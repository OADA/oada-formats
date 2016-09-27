var schemaUtil = require('../../../../../../schema-util');
var      vocab = require('../../../../../../vocab');

var oadaSchema = schemaUtil.oadaSchema;
var enumSchema = schemaUtil.enumSchema;
var restrictItems = schemaUtil.restrictItems;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var requireValue = schemaUtil.requireValue;

module.exports = oadaSchema({
  description: `The "yield-moisture" document contains as-harvested yield-moisture data.
                This is where a typical "yield map" from an existing FMIS software would
                go.  We encourage geospatial indexing here (rather than field-based).`,

  // oadaSchema will take care of representing all these indexing schemes by adding
  // their keys to context and to the base schema properties
  indexing: [ 'crop-index', 'geohash-length-index', 'geohash-index' ],
 
  properties: {
    // oadaSchema requires this _type on the schema it produces
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

    // oadaSchema handles requiring this exact context object, and adds the proper indexing
    // keys to it as it moves through the known indexing chains.
    context: {
      required: [ 'harvest', 'as-harvested' ], additionalProperties: true,
      properties: {
        harvest: requireValue('as-harvested'),
        'as-harvested': requireValue('yield-moisture-dataset'),
      },
    },

    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repeated for most data points here.
    templates: restrictItemsTo({
      collection: vocab('templates'),   // original collection schema
      restrictToSchema: vocabTermsToSchema([
        'id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width' 
      ]),
    }),

    // Data holds the actual yield and moisture data points.  The properties listed
    // here are the known subset for yield-moisture-dataset's.  If 'strict', it limits
    // the test to only these properties (no extras), but none of them become required.
    data: restrictItemsTo({
      collection: vocab('data'),
      restrictToSchema: vocabTermsToSchema([
        'id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width' 
      ]),
      required: [ 'area', 'weight', 'moisture', 'location' ],
    }),
  },
});
    

