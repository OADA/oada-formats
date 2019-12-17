const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);


module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.soil-temperature.1+json',

  indexing: [ 'year-index', 'day-index', 'hour-index' ],

  properties: {
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToProperties([
          // you can use "depth" here in the template for all samples taken at the 
          // same soil depth.
          'sensor', 'units', 'depth'
        ])),
      },
    }),
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToProperties([
          'id', 'template', 'time', 'value',
        ])),
      },
    }),
  },

});
