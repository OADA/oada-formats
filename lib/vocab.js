var _ = require('lodash');
var config = require('../config');
require('extend-error');

// Errors:
var UnknownVocabularyTerm = Error.extend('UnknownVocabularyTerm');
var NoPropertySchemaDefined = Error.extend('NoPropertySchemaDefined');
var NoPropertySchemaDefaultDefined = Error.extend('NoPropertySchemaDefaultDefined');
var NoPropertiesFound = Error.extend('NoPropertiesFound');
var NoModuleSpecified = Error.extend('NoModuleSpecified');

var modules = {};

module.exports = function(modulename) {
  if (!modulename) throw new NoModuleSpecified('No modulename was given to main vocab function.');
  if (modules[modulename]) return modules[modulename];

  var _M = { // short for _Module
    _vocab: {},
    _registrationOrder: 0, // increment on each registration, store with term.

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

    // propertySchemaToProperties creates properties and patternProperties on 
    // a schema according to rules defined in the propertySchema key.   It's purely 
    // a convenience to avoid having to write things twice above.  
    //
    // It uses two extensions to JSONSchema that I made up:
    // propertySchema defining what properties should look like, and
    // propertySchemaDefault defining what schema to put at each property if
    // the property name isn't a vocab term.  Supports oneOf[] arrays to recursively set
    // properties from a combination of propertySchemas. 
    // Note this function DOES NOT mutate the schema passed, it returns a new schema.
    //
    // This function is simplified by realizing that properties can only be strings
    // in our case (not objects or arrays), so any propertySchema used above must
    // either be an enumSchema or a string with a pattern.
    propertySchemaToProperties: function (main_schema, opts) {
      opts = opts || {};
      main_schema = _.cloneDeep(main_schema);
      var prop_default = main_schema.propertySchemaDefault;
      var prop_schema = main_schema.propertySchema;
      // you can optionally pass a different property schema:
      if (opts.overridePropertySchema) {
        prop_schema = opts.overridePropertySchema;
      }
      if (!prop_schema) {
        throw new NoPropertySchemaDefined('propertySchemaToProperties was called on term ' + term + ', but it has no propertySchema defined');
      }
      // If it's got a oneOf key or anyOf key or allOf key, loop through each and recurse
      // Look at geohash-length-index for example: the properties are a combination of
      // a pattern (geohash-X) and a known vocab term (datum).  This takes each individually
      // as if it were the only propertySchema on this term_schema and adds those properties.
      var arr;
      if (prop_schema.oneOf) arr = prop_schema.oneOf;
      if (prop_schema.anyOf) arr = prop_schema.anyOf;
      if (prop_schema.allOf) arr = prop_schema.allOf;
      if (arr) {
        // loop through each schema in the array and set any properties or patternProperties
        // that it warrants:
        _.each(arr, function(individual_propertySchema) {
          _M.propertySchemaToProperties(main_schema, {
            overridePropertySchema: individual_propertySchema
          });
        });
      }
      // Now check for pattern first.  patternProperties can only be set by the
      // schema_for_each function parameter since patterns aren't vocab words.
      if (prop_schema.pattern) {
        if (!main_schema.patternProperties) main_schema.patternProperties = {};
        if (!prop_default) {
          throw new NoPropertySchemaDefaultDefined('A pattern-based property schema was found for id ' + term_schema.id + ', but no default schema was defined to put there.');
        }
        main_schema.patternProperties[prop_schema.pattern] = prop_default;
      }
      // Now check if this is an enumSchema with a 'known' key that may have vocab
      // terms in it:
      if (prop_schema.known) {
        if (!main_schema.properties) main_schema.properties = {};
        // loop through each 'known' thing and make it a property:
        _.each(prop_schema.known, function(key) {
          // first set to default schema:
          if (prop_default) {
            main_schema.properties[key] = prop_default;
          }
          // vocab term replaced prop_default if it exists
          if (_M.vocab(key, { exists: true })) {
            main_schema.properties[key] = _M.vocab(key);
          }
          if (!main_schema.properties[key]) {
            throw new NoPropertySchemaDefaultDefined('A string property was found in schema ' + main_schema.id + ' that is not a vocab term ('+key+'), and no default schema was defined to put there.');
          }
        });
      }
      return main_schema;
    },


    // propertiesToPropertySchema is a convenience function that fills in the 
    // propertySchema for you if you defined all the properties.
    // Doesn't work if you have a complex schema that contains allOf, anyOf, oneOf.
    // NOTE: this DOES NOT mutate the schema passed, it returns a new schema.
    propertiesToPropertySchema: function(main_schema) {
      main_schema = _.cloneDeep(main_schema);
      if (!main_schema.properties) {
        throw new NoPropertiesFound('propertiesToPropertySchema called for id ' + main_schema.id + ', but it has no properties');
      }
      // Not supporting patternProperties for now because I don't see where I would ever
      // need that.
      main_schema.propertySchema = _M.enumSchema(_.keys(main_schema.properties));
      return main_schema;
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
    // - merge: { object } => merge this object into the resulting schema to override it
    // - also: { schema } => returns allOf: [ vocab(term), schema ]
    vocab: function (term, opts) {
      opts = opts || {};
      if (!term) { // if no term, return all known terms as an array of strings
        return _.keys(_M._vocab);
      }
      if (typeof _M._vocab[term] === 'undefined') { 
        if (opts.exists) return false; // they just wanted to test for existence
        throw new UnknownVocabularyTerm('The term "'+term+'" is not a known vocabulary term.');
      }
      if (opts.exists) return true; // they just wanted to test for existence
    
      var ret = _.cloneDeep(_M._vocab[term]);
      if (opts.merge) {
        _.merge(ret, opts.merge);
        // If changing the propertySchema or it's default, update the properties
        // from the new propertySchema:
        if (opts.merge.propertySchema || opts.merge.propertySchemaDefault) {
          ret = _M.propertySchemaToProperties(ret);
        }
      }
      // If there's an also schema, add it with allOf.  Useful when 
      // restricting a schema to a subset of the main vocab's properties.
      if (opts.also) {
        ret = {
          allOf: [ ret, opts.also ]
        };
      }

      return ret;
    },

    // sameAs is just a wrapper for vocab that keeps you from having to
    // write "merge" all the time up in the term definitions.
    sameAs: function(term, merge) {
      return _M.vocab(term, { merge: merge });
    },

    // register adds a term to the known vocabulary.  You can have opts of:
    // opts:
    // - skipCreatingProperties: skips step which creates properties from the
    //       propertySchema if there is a propertySchema on the object.
    // - skipCreatingPropertySchema: skips step which creates a propertySchema from the
    //       list of properties if there is not a propertySchema on the object.
    register: function(term, schema, opts) {
      opts = opts || {};
      // Add the id to the schema:
      if (!schema.id) {
        schema.id = 'oada-formats://vocab/' + modulename + '/' + term;
      }
      // If it has a propertySchema, create properties with it:
      if (schema.propertySchema && !opts.skipCreatingProperties) {
        schema = _M.propertySchemaToProperties(schema)
      }
      // If it has no propertySchema, make one if possible:
      if (!schema.propertySchema
          && schema.properties 
          && !opts.skipCreatingPropertySchema) {
        schema = _M.propertiesToPropertySchema(schema);
      }

      // Store original vocab source definition in the schema itself for reference later
      schema.vocab = { 
        module: modulename, 
        term: term,
        registrationOrder: _M._registrationOrder++,
      };

      // Store term in global vocab object:
      _M._vocab[term] = schema;
    },
  };

  modules[modulename] = _M;
  return _M;
};
