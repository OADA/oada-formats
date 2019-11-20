const libvocab = require('vocabs/oada');
const {link,override,patterns} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-hubs.1+json',
  description: 'Holds a listing of links to various sensor hubs (each hub may '+
                 'have many sensors it is responsible for',

  properties: {
    'serial-numbers': override('serial-numbers', {
      patternProperties: {
        [patterns.indexSafePropertyNames]: link(['application/vnd.oada.sensor-hub.1+json']),
      }
    }),
  },
});
