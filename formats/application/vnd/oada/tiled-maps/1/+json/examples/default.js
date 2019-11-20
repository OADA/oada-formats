module.exports = {
  _id:  'resources/029jfilwkjfo2i3ledkf',
  _rev: 5,
  _type: 'application/vnd.oada.tiled-maps.1+json',

  // tiled-maps are maps of data values that have been aggregated into
  // tiles at various zoom levels.  These are targeted at both efficient
  // display on a map and efficient statistical analysis using the magic
  // of hierarchy.

  // Known map types: dry-yield and moisture.
  // dry-yield: weights are reported at trade moisture for a crop
  'dry-yield-map': { _id: 'resources/k2fjo23lf3' },
  // moisture: readings of moisture recorded at harvest
  'moisture-map':  { _id: 'resources/k2fjo23lf3' },

};
