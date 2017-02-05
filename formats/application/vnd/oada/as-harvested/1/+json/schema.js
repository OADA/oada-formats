var schemaUtil = require('../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../vocabs/oada');
var versionedLink = schemaUtil.versionedLink;
var  requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({
  description: 'The "as-harvested" key holds the original data logged during harvest.  This can '+
               'be collections of time-series harvest data or data that is already geospatially '+
               'referenced.  A typical "yield map" exported from an FMIS system would go here.  '+
               'Think of this like the "raw" data that is used to generate tiled maps.',

  properties: {
    _type: 'application/vnd.oada.as-harvested.1+json',

    context: {
      required: [ 'harvest' ], additionalProperties: true,
      properties: {
        'harvest': requireValue('as-harvested'),
      }
    },

    'yield-moisture-dataset': versionedLink([
      'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    ]),
  },

});


