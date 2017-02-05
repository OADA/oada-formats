var schemaUtil = require('../../../../../../../lib/schema-util.js');

var versionedLink = schemaUtil.versionedLink;
var  requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({
  description: 'tiled-maps is used for visualization and statistical calculations, '+
               'and just generally for making arbitrary geospatial queries. '+
               'A tiled map is generated from the as-harvested source data which is  '+
               'turned into a set of data tiles at various zoom levels.  A mobile device '+
               'or other map-based viewer can request documents with data combined to '+
               'whatever zoom level it needs.  In addition, each tile in the map '+
               'contains statistical computations for all the underlying data represented '+
               'at that zoom level.  This means that if you want to take an average of '+
               'an area that completely contains a particular tile, you only need to  '+
               'get the stats for that tile, rather than iterating over the underlying data. '+
               'In reality, the value for a given "pixel" in a tile is just the stats object '+
               'of the much smaller geohash that sits on that pixel.',
  properties: {
    _type: 'application/vnd.oada.as-harvested.tiled-maps.1+json',

    context: {
      required: ['harvest'], additionalProperties: true,
      properties: {
        harvest: requireValue('tiled-maps'),
      },
    },

    'dry-yield-map': versionedLink([
      'application/vnd.oada.as-harvested.tiled-maps.dry-yield-map.1+json',
    ]),

    'moisture-map': versionedLink([
      'application/vnd.oada.as-harvested.tiled-maps.moisture-map.1+json',
    ]),
  },

});
