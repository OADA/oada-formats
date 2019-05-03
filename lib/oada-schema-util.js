var _ = require('lodash');
var config = require('../config');
require('extend-error');

const errors = {
   InvalidOadaSchemaError: Error.extend('InvalidOadaSchemaError'),
   NoPropertySchemaDefinedOnIndexVocabTermError: Error.extend('NoPropertySchemaDefinedOnIndexVocabTermError'),
};


module.exports = function(libVocab) {
  const {vocab,requireValue,enumSchema,override,idPrefix} = libVocab;

  // versionedLink is a convenience function for specifying a versioned link with
  // a list of known _type's 
  function versionedLink(knownTypes) {
    return override('versioned-link', {
      // replace any existing known types with this new array of known types
      properties: { _type: enumSchema(knownTypes) },
    });
  };

  // same as versionedLink, specify a regular link with a list of known _types:
  function link(knownTypes) {
    return override('link', {
      properties: { _type: enumSchema(knownTypes) },
    });
  };



  // addVocab adds a set of vocab terms as valid properties on a schema.
  // Updates propertySchema if it's a simple single enumSchema
  function addVocabAsProperties(schema, terms_array) {
    if (!schema.properties) schema.properties = {};
    _.each(terms_array, term => {
      schema.properties[term] = vocab(term);
    });
  };

  // oadaSchema is intended to be intelligent enough to let you specify an oada-based
  // schema in an concise a way as possible.  Some basic design goals for OADA schemas:
  // - all documents must have an _type
  // - all documents should allow unknown (custom) keys
  // - terms should be re-used as often as possible where they mean the same thing
  // This DOES NOT mutate schema: it returns a new object.
  function oadaSchema(schema) {
    schema = _.cloneDeep(schema);
    // First check for pre-requisite items: properties._type and properties.context
    if (!schema) {
      throw new errors.InvalidOadaSchemaError('you must provide a schema');
    }
    if (!schema.properties) {
      throw new errors.InvalidOadaSchemaError('you must provide a schema with properties');
    }
    if (!schema._type) {
      throw new errors.InvalidOadaSchemaError('you must provide a schema with a _type property');
    }
    // Next, fill in any easy missing items:
    // Create the _type property using the _type on top-level schema:
    schema.id = schema.id || idPrefix+'://'+schema._type;
    schema.properties = schema.properties || {};

    // Default allow unknown keys
    schema.additionalProperties = 
      (typeof schema.additionalProperties === 'undefined' ? true : schema.additionalProperties);

    // add basic OADA keys:
    addVocabAsProperties(schema, ['_id', '_rev', '_meta']);
    // Add the type under "properties"
    schema.properties._type = requireValue(schema._type);
    // _type is required to exist in an OADA document:
    schema.required = _.union(schema.required || [], [ '_type' ]);

    // indexing: the compact representation is just an array of vocab terms like: 
    // [ 'year-index', 'crop-index' ].  It is the job of oada-schema to turn that
    // compact representation into a real schema using the vocab.
    // Note: if an item in the indexing array is not a string, it is assumed to be a 
    // custom schema and is just used verbatim.
    // The point of the indexing term is to store which value an index has in a tree.
    // For example, if the URL for the dataset were 
    // year-index/2018/crop-index/corn, then the indexing array on the final json
    // document would be:
    // indexing: [
    //   { 
    //     index: 'crop-index',
    //     value: 'corn',
    //     source: 'oada.vocab.crop-type',
    //   },
    //   {
    //     index: 'year-index',
    //     value: '2018',
    //     source: 'oada.vocab.year',
    //   }
    //
    // ],
    //
    //--- the index definition itself should decide, but how?
    // {
    //   year-index: {
    //   // I have no way to specify this at the moment, becuase then a document
    //   // would have ONLY the index keys as top-level keys, not under an '*-index'
    //   // key.  Could have the index schema term defined with link at top, but
    //   // specialized key underneath
    //     _type: 'application/vnd.oada.as-harvested.1+json',
    //   },
    //   OR
    //   year-index: {
    //     '2018': { _id, _rev, _type: 'application/vnd.oada.as-harvested.1+json' },
    //     '2017': { _id, _rev, _type: 'application/vnd.oada.as-harvested.1+json' },
    //     '2016': { _id, _rev, _type: 'application/vnd.oada.as-harvested.1+json' },
    //   }
    //
    // }
    //
    //--- Also, what about an index like field-index whose source is another resource?
    //    There are a couple of fields-index spots:
    //    1: "core" fields-index where recursive fields are defined (self-sourced)
    //    2: spliting data like under yield.  This really shouldn't be done (fields change).
    //    3: recording field-level data like field average under yield.
    //
    //--- Also, what about gff-index?  Must it be 3 separate index keys, or is 1 with 3 layers
    //    sufficient?  grower-index/<grower>/farm-index/<farm>/fields-index/<field>
    //    In the case above, "fields-index" would pull double-duty.  In reality, grower-farm-field
    //    is rarely very big after "grower" (think co-op with many customers), so maybe it's never
    //    split up into different resources?  That gives gff-index an advantage over fields-index
    //    becaues it's available as a single flat resource...  oops, but then you can't link to
    //    an individual farm or field.  Bleh.  Ok, must be split up then.  I think perhaps since these
    //    are required by the domain, they should not be indexes.
    //    application/vnd.oada.gff.grower.1+json',
    //    application/vnd.oada.gff.farm.1+json',  // should point back to grower
    //    application/vnd.oada.gff.field.1+json', // should point back to grower, farm
    // {
    //   'grower-index': {
    //     'growerid1': {
    //       _type: 'application/vnd.oada.gff.1+json',
    //       'farm-index': {
    //         _type: 'application/vnd.oada.gff.1+json',
    //         '
    //       }
    //     },
    //     'growerid2': {
    //       _type: 'applicaiton/vnd.oada.gff.1+json',
    //     },
    //   },
    // }
    //
    //
    // that way the knowledge captured in the indexing in the URL is also available
    // in the document in the absence of the URL.  Note that since the document
    // may be accessible from multiple paths, this will only work for one "canonical"
    // path to the document.
    if (schema.indexing) {

      // First, setup the top-level indexing key for the schema:
      schema.properties.indexing = { 
        type: 'array',
        items: {
          anyOf: _.map(schema.indexing, i => {
            if (!vocab(i).indexPropertySchema) {
              throw new NoPropertySchemaDefinedOnIndexVocabTermError(
                schema._type+': Term '+i+' has no indexPropertySchema defined in '
                            +'the vocabulary.  It needs one in order to describe '
                            +'what its keys look like when used values instead of '
                            +'keys'
              );
            }
            return { 
              // year-index: { type: 'string', pattern: '^[0-9]{4}$' }
              // crop-index: { type: 'string', enum: [ 'corn', 'beans', 'wheat' ] }
              properties: { [i]: vocab(i).indexPropertySchema },
            };
          }),
        },
      };


      _.each(schema.indexing, 

      // Then, add properties on the schema for each index.
      // Each index's vocab() schema should have a generic link at some level,
      // so we just need to recurse downward until we find something that looks
      // like a link and set the current schema's _type as the type of thing that
      // it links to

// STOPPED HERE: after doing what the above paragraph describes, then figure out
// how we will handle making these indexes versioned links in the cases where we
// want versioned links down the chain (as-harvested) vs. unversioned links where 
// we don't (tiled maps)?

    }

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
    // First set additionalProperties on this one if it is an object:
    if (schema.type === 'object' || !schema.type) {
      schema.additionalProperties = newvalue;
    }
    // Then check any child properties for the same:
    _.each(_.keys(schema.properties), function(key) {
      recursivelyChangeAllAdditionalProperties(schema.properties[key], newvalue);
    });
    // Then check any child patternProperties for the same:
    _.each(_.keys(schema.patternProperties), function(key) {
      recursivelyChangeAllAdditionalProperties(schema.patternProperties[key], newvalue);
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

  return {
    versionedLink,
    link,
    oadaSchema,
    recursivelyChangeAllAdditionalProperties,
    errors,
  };
};

