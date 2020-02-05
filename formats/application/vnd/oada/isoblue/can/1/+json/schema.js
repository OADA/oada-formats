/* Example:
module.exports = {
  "key": { 
    "afdniji12non": {
      "time": 123456.789,
     	"is_error_frame": false,
     	"is_extended_frame": false,
    	"arbitration_id": 1234,
      "dlc": 1234,
    	"payload": 0x0102030405060708090A0B0C0D0E0F,
    	"is_remote_frame": false
    },
    "jnbj31knpo3i": {
      "time": 7891011.121314,
     	"is_error_frame": false,
     	"is_extended_frame": true,
     	"arbitration_id": 9876,
      "dlc": 54321,
     	"payload": 0xFFFEFDFCFBFA,
    	"is_remote_frame": 0
    },
  }
}
*/

const libvocab = require('vocabs/oada');
const {vocabToSchema,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);
// Import custom isoblue definitions
require('vocabs/isoblue');


module.exports = oadaSchema({
  _type: 'application/vnd.oada.isoblue.can.1+json',

  description: 'CAN frame collected from machine attached to ISOBlue (or similar) device',
    
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
          'id', 'time', 'is_error_frame', 'is_extended_frame', 'arbitration_id', 'dlc', 'payload', 'is_remote_frame',
        ])),
      },
    }),

    // Data holds the actual data points. If 'strict', it limits
    // the test to only these properties (no extras), but none of them become required.
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
            'id', 'time', 'is_error_frame', 'is_extended_frame', 'arbitration_id', 'dlc', 'payload', 'is_remote_frame',
          ]), 
          // mark some of the keys as required for every item:
          required: [ 'id', 'time' ],
        }),
      },
    }),
  },
});
