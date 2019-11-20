const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,override,patterns} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',
  description: 'The "dry-yield-map" document contains harvest data at the given crop\'s '+
               'trade moisture, aggregated at various zoom levels for mapping and '+
               'fast statistical calculation.',
  
  indexing: [ 'year-index', 'crop-index', 'geohash-length-index', 'geohash-index' ],

  properties: {

    datum: vocab('datum'),

    stats: override('stats', {
      properties: vocabToProperties([ 
        'template', 'geohash', 'area', 'weight', 'moisture', 
      ])
    }),

    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repreated for most data points here.
    // NOTE: since this is a 'dry-yield-map', the moisture value for each 
    // data point should be the same for the same crop.  Therefore, put
    // the moisture value in the template.  It's the trade moisture for the
    // crop.
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
            'template', 'geohash', 'area', 'weight', 'moisture',
          ]),
        }),
      },
    }),

    // geohash-data holds the actual yield and moisture stats for each tile.
    // Keys are valid geohash-strings of a given length (from context):
    'geohash-data': override('geohash-data', {
      patternProperties: {
        [patterns.geohash]: override('data-point', {
          properties: vocabToProperties([
            'template', 'geohash', 'area', 'weight', 'moisture',
          ]),
          required: [ 'area', 'weight' ],
        }),
      },
    }),
  },
});
    

