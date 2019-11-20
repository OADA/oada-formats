const libvocab = require('vocabs/oada');
const {vocab,versionedLink} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.harvest.1+json',
  description: 

'A harvest document holds links to information related to harvest activites or data.',

  properties: {
    'as-harvested': versionedLink([
      'application/vnd.oada.as-harvested.1+json'
    ]),

    'tiled-maps': versionedLink([
      'application/vnd.oada.tiled-maps.1+json'
    ]),
  },
  
});
