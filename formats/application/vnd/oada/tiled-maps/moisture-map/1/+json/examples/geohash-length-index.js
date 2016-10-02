module.exports = {
  _id: 'fj0o2i3jl3k2',
  _rev: '6-kldjf2io3lfke',
  _type: 'application/vnd.oada.tiled-maps.moisture-map.1+json',

  // This version of a moisture-map example has been already indexed by crop.
  // Next index is by geohash string length:
  context: {
    'harvest': 'tiled-maps',
    'tiled-maps': 'moisture-map',
    'crop': 'corn',
  },


  'geohash-length-index': {
    // datum can either be a string (known strings: WGS84)
    // or an object to specify more detail as at http://spatialreference.org/ref/epsg/wgs-84/json/
    'datum': 'WGS84',
    'geohash-7': { 
      _id: 'lkdjf02ijfelw', 
      _rev: '4-kdfj20io3jflksd',
      // Links back to same type of document for further indexing to a single geohash
      _type: 'application/vnd.oada.tiled-maps.moisture-map.1+json',
    },
  }
};


