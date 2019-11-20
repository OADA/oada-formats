const libvocab = require('vocabs/oada');
const {vocab,versionedLink} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.bookmarks.1+json',
  description: 'bookmarks is the top-level document returned by the OADA API',
  properties: {
        trellisfw: versionedLink(['application/vnd.trellis.1+json']),
         planting: versionedLink(['application/vnd.oada.planting.1+json']),
          harvest: versionedLink(['application/vnd.oada.harvest.1+json']),
         machines: versionedLink(['application/vnd.oada.machines.1+json']),
       irrigation: versionedLink(['application/vnd.oada.irrigation.1+json']),
          sensors: versionedLink(['application/vnd.oada.sensors.1+json']),
           fields: versionedLink(['application/vnd.oada.fields.1+json']),
          clients: versionedLink(['application/vnd.oada.clients.1+json']),
    'sensor-hubs': versionedLink(['application/vnd.oada.sensor-hubs.1+json']),
  },
});
