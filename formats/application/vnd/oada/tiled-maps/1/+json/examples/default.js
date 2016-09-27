{
  _id: 
  _rev: '5-kdfj02jfi32k3',
  _type: 'application/vnd.oada.tiled-maps.1+json',

  // tiled-maps are maps of data values that have been aggregated into
  // tiles at various zoom levels.  These are targeted at both efficient
  // display on a map and efficient statistical analysis using the magic
  // of hierarchy.

  context: {
    harvest: 'tiled-maps',
  },

  // Known map types: dry-yield and moisture.
  // dry-yield: weights are reported at trade moisture for a crop
  'dry-yield-map': { _id: 'k2fjo23lf3', _rev: '9-9034i2f3n33f' },
  // moisture: readings of moisture recorded at harvest
  'moisture-map':  { _id: 'k2fjo23lf3', _rev: '10-0f2jo3ijf3' },

}
