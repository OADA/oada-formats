const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.vibration.1+json',

  // vibration can be listed in quantization instead of raw values
  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties(['sensor', 'units', 'quantization']),
        })
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
            'id', 'template', 'time', 'value', 
            'sensor', 'units', 'quantization'
          ]),
        })
      },
    }),
  },
});
