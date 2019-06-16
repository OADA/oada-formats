var      vocab = require('../../../../../../../../vocabs/oada');
var schemaUtil = require('../../../../../../../../lib/oada-schema-util')(vocab);
const _ = require('lodash');

const {override,vocabToSchema,vocabToProperties,patterns} = vocab;

module.exports = schemaUtil.oadaSchema({
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

  description: 'The "yield-moisture" document contains as-harvested yield-moisture data. '+
               'This is where a typical "yield map" from an existing FMIS software would '+
               'go.  We encourage geospatial indexing here (rather than field-based).',
    
  indexing: [ 'year-index', 'crop-index', 'geohash-length-index', 'geohash-index' ],

  // oadaSchema will take care of representing all these indexing schemes by adding
  // their keys to the indexing property and to the base schema properties
  properties: {
    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repeated for most data points here.
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: vocabToSchema([
          'id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width' 
        ]),
      }
    }),


    // Data holds the actual yield and moisture data points.  The properties listed
    // here are the known subset for yield-moisture-dataset's.  If 'strict', it limits
    // the test to only these properties (no extras), but none of them become required.
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: {
          properties: vocabToProperties([
            'id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width' 
          ]), 
          // mark some of the keys as required for every item:
          required: [ 'area', 'weight', 'moisture', 'location' ],
        },
      },
    }),

  },
});
    

