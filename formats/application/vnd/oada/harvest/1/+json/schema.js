var schemaUtil = require('../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../oada-vocab');

module.exports = {
  description: `A harvest document holds links to information related to harvest.`,

  properties: {
    _type: 'application/vnd.oada.harvest.1+json',

    context: { },

    'as-harvested': versionedLink([
      'application/vnd.oada.as-harvested.1+json'
    ]),

    'tiled-maps': versionedLink([
      'application/vnd.oada.tiled-maps.1+json'
    ],
  },
  
};
