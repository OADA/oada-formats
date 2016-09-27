j{ 
  _id: 'ifjo2ifkl23', 
  _rev: '2-ihdofi223',
  // The data in the tile and the original 'yield-moisture' document
  // have the same type.  This is because a 'yield-moisture' document
  // can either contain data directly, or an index (or set of indexes)
  // to that data.  You can decide which by looking for the 'data' key:
  // if present, there is data here.  If not, follow the index until
  // you get to a 'data' key.
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

  context: {
    // you must have these two keys:
    'harvest': 'as-harvested',
    'as-harvested': 'yield-moisture-dataset'
    // In this case, these points are all for corn:
    'crop-index': 'corn',
    // and the size of the tile is a 7-character geohash:
    'geohash-length-index': 'geohash-7',
    // and only GPS points from inside this particular tile are included:
    'geohash-index': '9j9j12f',
  },

  // Templates are like object prototypes for data objects.  Any object which
  // refers to one of these keys from 'templates' should be merged
  // with that particular template object.  Provides a convenient way to not
  // have to keep repeating things over and over in the data portion of the document.
  templates: {
    // the key is just any random string distinguishing between templates:
    'k20ifkj': {
      // Known list of crop types maintained at https://github.com/oada/oada-formats
      'crop-type': 'corn',
      // List of known units for each type of data maintained at https://github.com/oada/oada-formats
      time: { units: 'unix-timestamp' },
      area: { units: 'acres', },
      weight: { units: 'bushels', },
      moisture: { units: '%H2O' },
      location: {
        datum: 'WGS84',
      },
    },
  },

  // Data is where the actual collection of data resides.  It's an unordered collection
  // so as to be a convergent replicated data type that can handle multiple simultaneous
  // data generation in eventually-consistent environments without causing conflicts.  This
  // basically means you put things into data by a simple POST operation, and the keys
  // under "data" are therefore just random strings identifying a particular object.
  data: {
    'kdjf02ijk3f': {
      // as with application/vnd.oada.sensor-data.generic.1+json, the 'id' field
      // is optional, but if it is used then it can be a unique identifier
      // within this cloud for this particular data point.
      id: '902jfl3jo2kf2l3f',
      // units for all these things are defined in the template.  Merge the template
      // with this document to get the full unit/value pairs.
      template: 'k20ifkj',
      time: { value: 192847322.14521 },
      area: { value: 1.1 },
      weight: { value: 2.5 },
      moisture: { value: 28.79 },
      location: { 
        latitude: -41.9384932,
        longitude: 80.9284923,
        altitude: 200.49583,
      },
    },
    '0f2jflk2j3l': {
      id: 'llll23jf02i2o3ffdsf',
      template: 'k20ifkj',
      // yield-moisture should have timestamps if it's available
      time: { value: 192847323.78321 },
      // each point needs to know the area it covers
      area: { value: '0.9' },
      // and the wet weight of crop harvested there:
      weight: { value: '2.3' },
      // and the recorded moisture for that weight:
      moisture: { value: 23.81 },
      // and the location where this weight was recorded:
      location: { 
        latitude: -41.9384931,
        longitude: 80.9284921,
        altitude: 200.49581,
      },
    },
  },
}
