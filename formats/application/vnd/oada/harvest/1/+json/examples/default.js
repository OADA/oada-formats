{
  _id: '290fijklf3',
  _rev: '7-9ijkljf0j2ifkl3f',
  _type: 'application/vnd.oada.harvest.1+json',

  // The 'as-harvested' key holds the original as-harvested data.  This 
  // can be collections of time-series harvest data or data that is 
  // already geospatially referenced.  A typical "yield map" exported
  // from an FMIS system would go here.  Think of this like the "raw"
  // data that is used to generate tiled maps.
  'as-harvested': {
    _id: 'kfj20ikejldss',
    _rev: '9-kfjo2i3jfelkfas',
    // Known types:
    // - application/vnd.oada.as-harvested.1+json
    _type: 'application/vnd.oada.as-harvested.1+json',
  },       

  // tiled-maps is used for visualization and statistical calculations,
  // and just generally for making arbitrary geospatial queries.
  // A tiled map is generated from the as-harvested source data which is 
  // turned into a set of data tiles at various zoom levels.  A mobile device
  // or other map-based viewer can request documents with data averaged to
  // whatever zoom level it needs.  In addition, each tile in the map
  // contains statistical computations for all the underlying data represented
  // at that zoom level.  This means that if you want to take an average of
  // an area that completely contains a particular tile, you only need to 
  // get the stats for that tile, rather than iterating over the underlying data.
  'tiled-maps': {
    _id: '92jfkjfe0fdi',
    _rev: '8-92fjkflkj492',
    // Known types:
    // - application/vnd.oada.tiled-maps.1+json
    _type: 'application/vnd.oada.tiled-maps.1+json',
  },
}
