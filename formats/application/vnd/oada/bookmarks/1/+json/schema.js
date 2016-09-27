var schemaUtil = require('../../../../../../../lib/schema-util.js');
var versionedLink = schemaUtil.versionedLink;
var      vocab = require('../../../../../../oada-vocab');

module.exports = schemaUtil.oadaSchema({
  description: `bookmarks is the top-level document returned by the OADA API`,
  properties: {
    _type: 'application/vnd.oada.bookmarks.1+json',

    context: {},

    planting: versionedLink([ 
      'application/vnd.oada.planting.1+json' 
    ]),

    harvest: versionedLink([ 
      'application/vnd.oada.harvest.1+json' 
    ]),

    machines: versionedLink([
      'application/vnd.oada.machines.1+json',
    ]),

    irrigation: versionedLink([
      'application/vnd.oada.irrigation.1+json',
    ]),

    sensors: versionedLink([
      'application/vnd.oada.sensors.1+json',
    ]),

    fields: versionedLink([
      'application/vnd.oada.fields.1+json',
    ]),

    clients: versionedLink([
      'application/vnd.oada.clients.1+json',
    ]),

    'sensor-hubs': versionedLink([
      'application/vnd.oada.sensor-hubs.1+json',
    ]),
  },
});
