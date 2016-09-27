var schemaUtil = require('../../../../../../../lib/schema-util.js');
var      vocab = require('../../../../../../oada-vocab');

var versionedLink = schemaUtil.versionedLink;
var  requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({
  description: `The "dry-yield-map" document contains harvest data at the given crop's
                trade moisture, aggregated at various zoom levels for mapping and
                fast statistical calculation.`,

  indexing: [ 'crop-index', 'geohash-length-index', 'geohash-index' ],

  properties: {
    _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',

    context: {
      required: [ 'harvest', 'tiled-maps' ], additionalProperties: true,
      properties: {
        harvest: requireValue('tiled-maps'),
        'tiled-maps': requireValue('dry-yield-map'),
      },
    },

    datum: vocab('datum'),

    stats: vocab('stats',{
      also: vocabTermsToSchema([ 
        'template', 'geohash', 'area', 'weight', 'moisture', 
      ]),
    }),

    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repreated for most data points here.
    // NOTE: since this is a 'dry-yield-map', the moisture value for each 
    // data point should be the same for the same crop.  Therefore, put
    // the moisture value in the template.  It's the trade moisture for the
    // crop.
    templates: restrictItemsTo({
      collection: vocab('templates'),
      restrictToSchema: vocabTermsToSchema([
        'template', 'geohash', 'area', 'weight', 'moisture',
      ]),
    }),

    // geohash-data holds the actual yield and moisture stats for each tile.
    // Keys are valid geohash-strings of a given length (from context):
    'geohash-data': restrictItemsTo({
      collection: vocab('geohash-data'),
      restrictToSchema: vocabTermsToSchema([
        'template', 'geohash', 'area', 'weight', 'moisture',
      ],
      required: [ 'area', 'weight' ],
    }),
  },
});
    

