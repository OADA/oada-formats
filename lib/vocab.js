var _ = require('lodash');
var config = require('../config');
require('extend-error');

// Errors:
const errors = {
  UnknownVocabularyTerm: Error.extend('UnknownVocabularyTerm'),
  NoPropertySchemaDefined: Error.extend('NoPropertySchemaDefined'),
  NoPropertySchemaDefaultDefined: Error.extend('NoPropertySchemaDefaultDefined'),
  NoPropertiesFound: Error.extend('NoPropertiesFound'),
  NoModuleSpecified: Error.extend('NoModuleSpecified'),
};

var modules = {};

module.exports = function(modulename, opts) {
  if (!modulename) throw new errors.NoModuleSpecified('No modulename was given to main vocab function.');
  if (modules[modulename]) return modules[modulename]; // singleton instance per module

  opts = opts || { idPrefix: modulename };


  const _M = { // short for _Module

    _vocab: {},
    _registrationOrder: 0, // increment on each registration, store with term.

    // patterns is for storing re-usable regular expression patterns on this object.
    // Note that this does not start with an underscore: it is intended to be accessible
    // to the outside world as-is.
    patterns: {
      // Any sort of index-ed keys need to have a patternProperties that
      // defines what you'll get in the regular list of items, and 
      // the random strings (uuid's) that key those items should not
      // conflict with reserved keywords (indexing, *-index, source,
      // oada keywords starting with _), etc.  For convenience, you can 
      // use this regular expression as the key in your patternProperties:
      indexSafePropertyNames: '^(?!(indexing|.*-index|_.*)).*$',
    },

    // enumSchema checks the global config for strictness.  If not strict,
    // returns a schema that matches a string.  If strict, returns a schema
    // that matches a string which can only be the known set of values.  Also
    // includes a custom key called 'known' which records the original set of
    // known values regardless of the config setting.
    //
    // The parameter to enumSchema can be either an array, or an object which
    // at least contains a 'known' key.  
    enumSchema: function (values) {
      // first assume ret is already object with 'known':
      var ret = values;
      // if it's an array, replace with object that has 'known':
      if (_.isArray(values)) { ret = { known: values }; }
      // Make sure it has a type:
      if (!ret.type) { ret.type = 'string' };
      // Add enum if running in strict mode:
      if (config.get('strict')) {
        ret.enum = ret.known;
      }
      return ret;
    },

    // requireValue is just a wrapper for a single-item enum that effectively
    // requires the string value to be exactly that single item.
    requireValue: function (val) {
      return { type: 'string', enum: [ val ] };
    },

    // vocabToProperties returns an object with keys that are vocab terms, and values that are the schemas
    // for those vocab terms.
    vocabToProperties: function(terms_array) {
      return _.zipObject(terms_array, _.map(terms_array, _M.vocab))
    },

    // vocabToSchema returns a full schema with the terms under the properties key.
    vocabToSchema: function(terms_array) {
      return { properties: _M.vocabToProperties(terms_array) };
    },

    // arrayToProperties is just a simple wrapper that copies the same schema at an array of different key names
    arrayToProperties: function(arr, schema, opts) {
      opts = opts || {};
      merge = opts.merge || {};
      if (!_.isArray(arr)) return {};
      return _.merge(merge, _.zipObject(arr, _.fill(Array(arr.length), schema)));
    },

    // override will return a merged schema that starts with the schema for a known
    // vocab term, but then completely replaces any common keys.  i.e. if the original
    // one had a set of "known" or "enum" items, then this will replace those completely
    // as opposed to concatenating them.  i.e. it "limits" the known things to just those
    // passed.  It also safely retains the parent's vocab object details under vocab.parent.
    // opts: mergePropertiesInsteadOfReplace = true|false
    //         if true, and the merge item has a properties key, it will completely replace the 
    //         properties key on the original.
    //         if false, and the merge item has a properties key, each of the properties
    //         from merge will override that individual property but leave others untouched.
    override: function(term, merge, opts) {
      const {mergePropertiesInsteadOfReplace} = opts || {};
      merge = _.cloneDeep(merge);
      const ret = _M.vocab(term);
      const previousVocab = ret.vocab;
      ret.vocab =  { parent: ret.vocab };
      return _.mergeWith(ret, merge, (first,second,key) => {
        if (_.isArray(second)) return second; // keep only the "second" (i.e. merge one)
        if (!mergePropertiesInsteadOfReplace && key === 'properties') {
          return second; // only use the second's properties
        }
        if (!mergePropertiesInsteadOfReplace && key === 'patternProperties') {
          return second; // only use the second's patternProperties
        }
        // otherwise, returns undefined and normal merge is done
      });
    },

    // This is a special function that understands what a link looks like in OADA,
    // and adds annotations to it's schema to indicate which type(s) of resource(s)
    // this should link to.  This is not testable as part of the schema within one
    // resource since you would need to go get the resource at the link to figure out
    // what type it is, but it does come in handy for defining how a tree should look.
    // The resulting schema will look something like this:
    // {
    //   properties: {
    //     _id: ... schema for _id ...
    //     _rev: .. schema for _rev ..
    //   }
    //   vocab: {
    //     _types: [ ], // we're adding this key
    //   }
    // }
    // Note that if you have another vocab term defined that is a link which
    // already links to some other types, you can pass "optional_base_link_schema"
    // and this will concatenate the new _type(s) with what's already there.
    link: function(type_or_array_of_types, optional_base_link_schema) {
      let s = optional_base_link_schema;
      if (!s || typeof s !== 'object') {
        // If this vocab does not have a link, register one so we can use it:
        if (!_M._vocab.link) {
          _M.register('link', {
            description: 'A link in OADA has at least an _id key and links one resource to another.',
            properties: { _id: { type: 'string' } },
            required: [ '_id' ],
          });
        }
        s = _M.vocab('link'); // deep copy of link schema
      }
      if (typeof type_or_array_of_types === 'string') {
        type_or_array_of_types = [ type_or_array_of_types ];
      }
      type_or_array_of_types = type_or_array_of_types || [];
      s.vocab = s.vocab || {};
      s.vocab._types = s.vocab._types || [];
      s.vocab._types = _.concat(s.vocab._types, type_or_array_of_types);
      return s;
    },

    //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    // Main export of this module: function to access _vocab information:
    //--------------------------------------------------------------------

    // Use a function to access vocab terms and schemas so we can copy each one
    // as needed to prevent accidentally changing them.  
    // If nothing is passed, it returns the list of all known terms.
    // You can have opts of:
    // opts:
    // - exists: true => return true or false if term exists
    vocab: function (term, opts) {
      opts = opts || {};
      if (!term) { // if no term, return all known terms as an array of strings
        return _.keys(_M._vocab);
      }
      if (typeof _M._vocab[term] === 'undefined') { 
        if (opts.exists) return false; // they just wanted to test for existence
        throw new errors.UnknownVocabularyTerm('The term "'+term+'" is not a known vocabulary term.');
      }
      if (opts.exists) return true; // they just wanted to test for existence
      return _.cloneDeep(_M._vocab[term]);
    },

    // register adds a term to the known vocabulary.
    register: function(term, schema) {
      schema = _.cloneDeep(schema);  // make a copy rather than mutating

      // Store original vocab source definition in the schema itself for reference later
      schema.vocab = { 
        module: modulename, 
        term: term,
        registrationOrder: _M._registrationOrder++,
        // note that override will also set "parent" here
      };

      // Store term in global vocab object:
      _M._vocab[term] = schema;
    },

    setPattern: function(name, pattern) {
      _M.patterns[name] = pattern;
    },
  };

  modules[modulename] = _M;

  // Export the errors for the outside world to use if desired
  _M.errors = errors;

  return _M;
};
