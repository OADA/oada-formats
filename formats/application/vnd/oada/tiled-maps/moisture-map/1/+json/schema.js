var schemaUtil = require('../../../../../../../../lib/schema-util.js');
var      vocab = require('../../../../../../../../vocabs/oada');
const _ = require('lodash');

var versionedLink = schemaUtil.versionedLink;
var  requireValue = schemaUtil.requireValue;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var restrictItemsTo = schemaUtil.restrictItemsTo;

module.exports = schemaUtil.oadaSchema({
  description: 

'The "moisture-map" document contains harvest data at the given crop\'s '+
'trade moisture, aggregated at various zoom levels for mapping and '+
'fast statistical calculation',

  indexing: [ 'crop-index', 'geohash-length-index', 'geohash-index' ],

  properties: {

    _type: 'application/vnd.oada-tiled-maps.moisture-map.1+jspn',

    // context must be at least this (can have more keys):
    context: {
      required: [ 'harvest', 'tiled-maps' ], additionalProperties: true,
      properties: {
        harvest: 'tiled-maps',
        'tiled-maps': 'moisture-map',
      }
    },

    datum: vocab('datum'),

    stats: vocab('stats', {
      also: vocabTermsToSchema([
        'template', 'geohash', 'area', 'moisture',
      ]),
    }),

    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repreated for most data points here.
    templates: restrictItemsTo({
      collection: vocab('templates'),
      restrictToSchema: vocabTermsToSchema([
        'template', 'geohash', 'area', 'moisture',
      ]),
    }),


    // geohash-data holds the actual yield and moisture stats for each tile.
    // Keys are valid geohash-strings of a given length (from context):
    'geohash-data': restrictItemsTo({
      collection: vocab('geohash-data'),
      restrictToSchema: _.merge(vocabTermsToSchema([
        'template', 'geohash', 'area', 'weight', 'moisture',
      ],{ required: [ 'area', 'moisture' ]}),
    }),

  },
});


