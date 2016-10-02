module.exports = {
  _id: 'fj0o2i3jl3k2',
  _rev: '6-kldjf2io3lfke',
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

  // This version of a yield-moisture example has been already indexed by crop,
  // and then is indexed by geohash-length here in this version.
  context: {
    'harvest': 'as-harvested',
    'as-harvested': 'yield-moisture-dataset',
    'crop-index': 'corn',
  },


  // A 'geohash-index' has a list of known geohash string lengths.  In the case of 
  // yield-moisture, a 7-character geohash is a great size: on the order of 
  // 1,000 points per tile.  Yield data should be indexed this way because it is
  // projection-independent, and does not depend on an arbitrarily-assigned field
  // boundary.
  'geohash-length-index': {
    // datum can either be a string (known strings: WGS84)
    // or an object to specify more detail as at http://spatialreference.org/ref/epsg/wgs-84/json/
    'datum': 'WGS84',
    'geohash-7': { 
      _id: 'lkdjf02ijfelw', 
      _rev: '4-kdfj20io3jflksd',
      // Links back to same type of document for further indexing to a single geohash
      _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    },
  },
};

