const libvocab = require('vocabs/oada');
const {enumSchema,vocabToSchema,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.vibration.1+json',

  // vibration can be listed in quantization instead of raw values
  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'sensor', 'units', 'quantization',
        ], {
          // known units are Hz or 'quantization' which means reported in levels
          units: override('units', enumSchema(['Hz', 'quantization'])),
        })),
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'id', 'template', 'time', 'value',
        ])),
      },
    }),
  },
});
