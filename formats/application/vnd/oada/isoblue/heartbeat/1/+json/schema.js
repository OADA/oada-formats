/* Example:
module.export = {
  "key": {
    "ghuenwpmrm": {
      "time": 1574107208.016281,
      "cell_ns": -79,
      "wifi_ns": -70,
      "backlog": 311536,
      "netled": 1,
      "statled": 1
	 },
    "acd4nn6eaf": {
      "time": 1574107238.016302,
      "cell_ns": -79,
      "wifi_ns": -70,
      "backlog": 308537,
      "netled": 1,
      "statled": 1
    },
  }
}
*/

const libvocab = require('vocabs/oada');
const {vocab,vocabToSchema,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);
// Import custom isoblue definitions
require('vocabs/isoblue');


module.exports = oadaSchema({
  _type: 'application/vnd.oada.isoblue.heartbeat.1+json',

  description: 'Hearbeat data from the ISOBlue device. Contains information such as network ' +
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
