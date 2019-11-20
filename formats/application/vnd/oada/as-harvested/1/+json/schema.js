const libvocab = require('vocabs/oada');
const {link} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.oada.as-harvested.1+json',
  description: 'The "as-harvested" key holds the original data logged during harvest.  This can '+
               'be collections of time-series harvest data or data that is already geospatially '+
               'referenced.  A typical "yield map" exported from an FMIS system would go here.  '+
               'Think of this like the "raw" data that is used to generate tiled maps.',

  properties: {
    'yield-moisture-dataset': link([
      'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    ]),
  },

});


