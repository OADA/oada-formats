
const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada-tiled-maps.moisture-map.1+jspn',
  description: 'The "moisture-map" document contains harvested moisture readings'+
               'trade moisture, aggregated at various zoom levels for mapping and '+
               'fast statistical calculation',

  indexing: [ 'year-index', 'crop-index', 'geohash-length-index', 'geohash-index' ],

  properties: {
    datum: vocab('datum'),

    stats: override('stats', {
      properties: vocabToProperties([
        'template', 'geohash', 'area', 'moisture',
      ]),
    }),

    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repreated for most data points here.
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
            'template', 'geohash', 'area', 'moisture',
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
            'template', 'geohash', 'area', 'moisture',
          ]),
          required: [ 'area', 'moisture' ],
        }),
      },
    }),
  },
});


