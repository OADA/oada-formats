const libvocab = require('vocabs/oada');
const {vocab,vocabToSchema,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.rainfall.1+json',

  indexing: [ 'year-index', 'day-index', 'hour-index' ],

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'sensor', 'units', 'rate',
        ],{
          units: override('units', enumSchema(['m', 'in']),
          rate: override('rate', { 
            properties: {
              units: enumSchema(['m/s', 'in/s', 'in/h']),
            }
          }),
        })),
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToProperties([
          'id', 'template', 'time-start', 'time-end', 'value', 'rate', 'is-freezing'
        ])),
      },
    }),
  },
});
