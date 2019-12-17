const libvocab = require('vocabs/oada');
const {vocab,vocabToSchema,patterns,override,enumSchema} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.wind-speed.1+json',

  indexing: [ 'year-index', 'day-index', 'hour-index' ],

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([ 
          'sensor', 'units' 
        ], {
          units: override('units', enumSchema(['m/s', 'ft/s', 'mph'])),
        })),
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'id', 'template', 'time-start', 'time-end', 
          'max', 'mean', 'min', 'std', 'inst'
        ])),
      },
    }),
  },

});
