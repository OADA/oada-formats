const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = {
  _type: 'application/vnd.oada.sensor-data.rainfall.1+json',
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
};
