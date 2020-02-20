const libvocab = require('vocabs/oada');
const {enumSchema,vocabToSchema,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.cloud-cover.1+json',

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'sensor', 'units',
        ], {
          // known units are '%', although precision could be oktas (i.e. eighths)
          units: override('units', enumSchema(['%'])),
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


