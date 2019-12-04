const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.rainfall.1+json',

  indexing: [ 'year-index', 'day-index', 'hour-index' ],

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToProperties([
          'sensor', 'units', 'rate'
        ])),
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
