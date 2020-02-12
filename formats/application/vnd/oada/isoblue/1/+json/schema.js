const libvocab = require('vocabs/oada');
const {versionedLink} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.isoblue.1+json',
  description: 'The ISOBlue document holds links to data related to (often collected by)' +
               ' the ISOBlue device',

  properties: {
    'can': versionedLink([
      'application/vnd.oada.isoblue.can.1+json'
    ]),
    'heartbeat': versionedLink([
      'application/vnd.oada.isoblue.heartbeat.1+json'
    ]),
    'location': versionedLink([
      'application/vnd.oada.isoblue.location.1+json'
    ]),
  },
});