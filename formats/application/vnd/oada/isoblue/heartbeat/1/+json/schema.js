const libvocab = require('vocabs/oada');
const {vocab,vocabToSchema,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.isoblue.heartbeat.1+json',

  description: 'Heartbeat data from the ISOBlue device. Contains information such as network ' +
               'strength, upload backlog, and other debugging information.', 
    
  indexing: [ 'year-index', 'day-index', 'hour-index' ],

  // oadaSchema will take care of representing all these indexing schemes by adding
  // their keys to the indexing property and to the base schema properties
  properties: {
    // templates are object prototypes for data points: i.e. a full data point
    // is a merge of it's template with the data point itself.  Put things
    // like units that are repeated for most data points here.
    templates: override('templates', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', vocabToSchema([
          'id', 'time', 'cell_ns', 'wifi_ns', 'backlog', 'netled', 'statled',
        ])),
      },
    }),

    // Data holds the actual data points. If 'strict', it limits
    // the test to only these properties (no extras), but none of them become required.
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
           'id', 'time', 'cell_ns', 'wifi_ns', 'backlog', 'netled', 'statled',
          ]), 
          // mark some of the keys as required for every item:
          required: [ 'id', 'time' ],
        }),
      },
    }),
  },
});
