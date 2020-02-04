/* Example:
module.export = {
  "key": {
    "iafdn1efrs": {
	    "time": 1574056800,
      "lat": 40.42966078,
      "lng": -86.912286476
    },
    "1pasdjfenw": {
      "time": 1574056801,
      "lat": 40.429661482,
      "lng": -86.91228494
    },
    "893rhifjnd": {
      "time": 157056802,
      "lat": 40.42966198,
      "lng": -86.912284562
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
  _type: 'application/vnd.oada.isoblue.location.1+json',

  description: 'Location data of the machine. Contains time, latitude, and longitude.', 
    
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
          'id', 'time', 'lat', 'lng',
        ])),
      },
    }),

    // Data holds the actual data points. If 'strict', it limits
    // the test to only these properties (no extras), but none of them become required.
    data: override('data', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: override('data-point', {
          properties: vocabToProperties([
            'id', 'time', 'lat', 'lng' 
          ]), 
          // mark some of the keys as required for every item:
          required: [ 'id', 'time', 'lat', 'lng' ],
        }),
      },
    }),
  },
});
