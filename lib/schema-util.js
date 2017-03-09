var _ = require('lodash');
var vocab = require('../vocabs/oada');
var config = require('../config');
require('extend-error');

var enumSchema = vocab.enumSchema;

var InvalidOadaSchemaError = Error.extend('InvalidOadaSchemaError');
var InvalidRestrictionOpts = Error.extend('InvalidRestrictionOpts');

// Turns out any documents which contain data want to be able to specify the
// kind of data keys you'd expect to find in it's data objects.  This function
// conveniently lets you take an existing schema for a collection of data objects,
// and restrict each one to make the original schema AND the restricted schema
// passed in.
// opts:
// - collection: original collection's schema to restrict
// - restrictToSchema: new schema to limit original schema with
// - required: an additional list of required keys

function restrictItemsTo(opts) {
  if (!opts) {
    throw new InvalidRestrictionOpts('you did not pass any opts to restrictItems');
  }
  if (!opts.collection) {
    throw new InvalidRestrictionOpts('you did not specify an opts with a collection in it');
  }
  if (!opts.restrictToSchema) {
    throw new InvalidRestrictionOpts('you did not specify an opts with a restricting schema');
  }
  var s = _.cloneDeep(opts.collection);
  if (!s.patternProperties) {
    throw new InvalidRestrictionOpts('collection is not a collection with patternProperties');
  }
  _.each(_.keys(s.patternProperties), function(key) {
    s.patternProperties[key] = {
      allOf: [
        s.patternProperties[key],
        opts.restrictToSchema
      ]
    };
  });
  if (opts.required) {
    if (!s.required) s.required = [];
    s.required = _.union(s.required, opts.required);
    if (s.required.length < 0) delete s.required; // 'required' has to have at least one element
  }
  return s; 
};

// versionedLink is a convenience function for specifying a versioned link with
// a list of known _type's 
function versionedLink(types) {
  return vocab('versioned-link', {
    properties: {
      _type: enumSchema(types),
    },
  });
};


// requireValue is a convenience function for getting a schema that requires
// a key to be a single value
function requireValue(val) {
  return { type: 'string', enum: [ val ] };
}


// If you just want a schema for an object made entirely of vocab terms,
// use this function for convenience.  opts is deep merged with the 
// generated schema, overriding any individual items it finds.
// opts:
// - vocabfunc: alternate function to use for vocab instead of OADA function
function vocabTermsToSchema(terms_array, overrideSchema, opts) {
  opts = opts || {};
  overrideSchema = overrideSchema || {};
  const vocabfunc = opts.vocabfunc || vocab;
  var ret = {
    additionalProperties: true,
    propertySchema: enumSchema(terms_array),
    properties: _.zipObject(terms_array, _.map(terms_array, vocabfunc))
  };
  ret = _.merge(overrideSchema, ret); // add/override with anything passed in opts
  return ret;
};

// addVocab adds a set of vocab terms as valid properties on a schema.
// Updates propertySchema if it's a simple single enumSchema
function addVocabAsProperties(schema, terms_array) {
  if (!schema.properties) schema.properties = {};
  var propertySchema = schema.propertySchema || {};
  _.each(terms_array, function(term) {
    schema.properties[term] = vocab(term)
    if (propertySchema) {
      if (propertySchema.known) {
        propertySchema.known.push(term);
      }
      if (propertySchema.enum) {
        propertySchema.enum.push(term);
      }
    }
  });
};

  // oadaSchema is intended to be intelligent enough to let you specify an oada-based
  // schema in an concise a way as possible.  Some basic design goals for OADA schemas:
  // - all documents must have an _type
  // - all documents should allow unknown (custom) keys
  // - terms should be re-used as often as possible where they mean the same thing
  // This DOES NOT mutate schema: it returns a new object
function oadaSchema(schema) {
    schema = _.cloneDeep(schema);
    // First check for pre-requisite items: properties._type and properties.context
    if (!schema) {
      throw new InvalidOadaSchemaError('you must provide a schema');
    }
    var props = schema.properties; // shorter to type
    if (!props) {
      throw new InvalidOadaSchemaError('you must provide a schema with properties');
    }
    if (!props._type) {
      throw new InvalidOadaSchemaError('you must provide a schema with a _type property');
    }
    // Second, fill in any easy missing items:
    schema.id = schema.id || 'oada-formats://'+props._type;
    // require _type and context
    schema.required = _.union(schema.required || [], [ '_type', ]);
    schema.additionalProperties = 
      (typeof schema.additionalProperties === 'undefined' ? true : schema.additionalProperties);
    // add basic OADA keys:
    addVocabAsProperties(schema, ['_id', '_rev', '_type', '_meta']);
    // if _type is just the type string, replace with valid JSONSchema object:
    if (typeof props._type === 'string') {
      props._type = { type: 'string', enum: [ props._type ] };
    }

    // Merge in the known indexing schemes as possible context items:
    if (schema.indexing) {
      props.context = props.context || {};
      _.merge(props.context, { 
        properties: _.zipObject(
          schema.indexing, 
          _.map(schema.indexing, function(index) {
            return vocab(index).propertySchema // each index's value in 'context' must be one of it's properties
          }))
      })
    }
    // Make sure this context matches both the global context term
    // and this particular version of it:
    if (props.context) {
      props.context = vocab('context', { also: props.context });
    }

    // add the indexing keys as possible properties, and set this _type
    // as the type they link to:
    var _type = props._type || props._type.enum[0];
    _.merge(props, _.zipObject(
      schema.indexing,
      _.map(schema.indexing, function(index) {
        return vocab(index, {
          // add _type to the links in the index collection:
          merge: { propertySchemaDefault: { _type: _type } },
        });
      })
    ));

    // and finally, if we're in strict mode change all the additionalProperties to false:
    if (config.get('strict')) {
      recursivelyChangeAllAdditionalProperties(schema, false);
    }

    return schema;
};


// recursivelyChangeAllAdditionalProperties is used when "strict" mode is turned
// on to set all the additionalProperties variables to false.  Use only for
// developer testing to ensure you didn't mispell things because that is not
// the true definition of these schemas.
// Note this mutates the schema passed.
function recursivelyChangeAllAdditionalProperties(schema, newvalue) {
  if (!schema) return;
  // First set additionalProperties if it's here:
  if (typeof schema.additionalProperties !== 'undefined') {
    schema.additionalProperties = newvalue;
  }
  // Then check any child properties for the same:
  _.each(_.keys(schema.properties), function(child_schema) {
    recursivelyChangeAllAdditionalProperties(child_schema, newvalue);
  });
  // Then check any child patternProperties for the same:
  _.each(_.keys(schema.patternProperties), function(child_schema) {
    recursivelyChangeAllAdditionalProperties(child_schema, newvalue);
  });
  // Then check for anyOf, allOf, oneOf
  _.each(schema.anyOf, function(child_schema) {
    recursivelyChangeAllAdditionalProperties(child_schema, newvalue);
  });
  _.each(schema.allOf, function(child_schema) {
    recursivelyChangeAllAdditionalProperties(child_schema, newvalue);
  });
  _.each(schema.oneOf, function(child_schema) {
    recursivelyChangeAllAdditionalProperties(child_schema, newvalue);
  });
  // ignoring 'not' for now
};

module.exports = {
  enumSchema: enumSchema,
  restrictItemsTo: restrictItemsTo,
  vocabTermsToSchema: vocabTermsToSchema,
  versionedLink: versionedLink,
  oadaSchema: oadaSchema,
  requireValue: requireValue,
  recursivelyChangeAllAdditionalProperties: recursivelyChangeAllAdditionalProperties,
};


