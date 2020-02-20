const libvocab = require('vocabs/oada');
const {enumSchema,vocabToSchema,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.location.1+json',

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'sensor', 'location',
        ], {
          // specifically, template should have the datum under the location:
          location: override('location', vocabToSchema(['datum'])),
        })),
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'id', 'template', 'time', 'location',
        ])),
      },
    }),
  },
});

