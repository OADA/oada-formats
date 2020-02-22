module.exports = {
  _type: 'application/vnd.oada.isoblue.1+json',

  // The CAN key holds CAN messages logged by the ISOBlue can logging module
  'can': {
    _id: 'kfj20ikejldss',
  },       

  // heartbeat provides numerous debugging information about the current status
  // and health of the ISOblue device. This was primarily developed for development
  // use, however apps can use it to verify that the device is healthy. Due to it's
  // development/debugging nature, the schema is to be kept flexible to allow quick
  // addition and deletion of various miscellaneous data points
  'heartbeat': {
    _id: '92jfkjfe0fdi',
  },


  // the location key provides time based location that the GPS module of the ISOBlue
  // device reports
  'location': {
    _id: '92jfkjfe0fdi',
  },
};
