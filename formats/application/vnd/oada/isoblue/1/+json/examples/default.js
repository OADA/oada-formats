module.exports = {
  _id: '290fijklf3',
  _rev: '7-9ijkljf0j2ifkl3f',
  _type: 'application/vnd.oada.harvest.1+json',

  context: {},

  // The CAN key holds CAN messages logged by the ISOBlue can logging module
  'can': {
    _id: 'kfj20ikejldss',
    _rev: '9-kfjo2i3jfelkfas',

    _type: 'application/vnd.oada.isoblue.can.1+json',
  },       

  // heartbeat provides numerous debugging information about the current status
  // and health of the ISOblue device. This was primarily developed for development
  // use, however apps can use it to verify that the device is healthy. Due to it's
  // development/debugging nature, the schema is to be kept flexible to allow quick
  // addition and deletion of various miscellaneous data points
  'heartbeat': {
    _id: '92jfkjfe0fdi',
    _rev: '8-92fjkflkj492',
    _type: 'application/vnd.oada.isoblue.heartbeat.1+json',
  },


  // the location key provides time based location that the GPS module of the ISOBlue
  // device reports
  'location': {
    _id: '92jfkjfe0fdi',
    _rev: '8-92fjkflkj492',
    _type: 'application/vnd.oada.isoblue.1+json',
  },
};
