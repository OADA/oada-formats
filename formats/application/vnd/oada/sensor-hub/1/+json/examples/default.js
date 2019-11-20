module.exports = {
  _type: 'application/vnd.oada.sensor-hub.1+json',

  // All keys in this document are optional

  name: 'Smith Irrigator Pivot Hub',

  // The location object is designed to be flexible: if it's just a point
  // it can be lat/lon/alt, but if it's more complex it can be geojson.  Either
  // is allowed.  Note that if a hub's location can change, then this location,
  // if it exists, is superceded by the data stream of locations.
  location: { 
    latitude: -40.2131241234213, 
    longitude: 80.980293423,
    // altitude: 200.3984893, optional altitude
    // geojson: ...or some geojson...
    // _id: this can also be a link to an indexable time series of GPS points.
  },

  // Information about all the sensors connected to this hub.
  // Keys in this object should be serial numbers of sensors.
  sensors: {
    '902jf3k23': { _id: '9023fj20', _rev: 3 },
  },

  // The data captured by the sensors that are connected to this 
  // hub is organized under the keys below.  Note that since 
  // 'location' is a special type of data that is really an identifier
  // for other types of data, it should be listed either in the 'location'
  // key above, in a 'location' key under an individual sensor, or under
  // a 'location' key according to the sensor-data schemas.
      'air-temperature': { _id: '8f02jkl', _rev: 1 },
        'soil-moisture': { _id: 'kdjf092', _rev: 1 },
     'soil-temperature': { _id: '92kfjl2', _rev: 1 },
  'barometric-pressure': { _id: 'dmkgf39', _rev: 1 },
            'dew-point': { _id: 'qoakldj', _rev: 1 },
    'relative-humidity': { _id: 'kejf902', _rev: 1 },
           // Note: wind-speed will have average and max under it
           'wind-speed': { _id: 'kdw00w0', _rev: 1 },
           // Note: wind-direction will have average and max under it
       'wind-direction': { _id: 'iiifjwl', _rev: 1 },
          'cloud-cover': { _id: '19139jf', _rev: 1 },
      'solar-radiation': { _id: '555ikdf', _rev: 1 },
             'rainfall': { _id: 'kljdfo2', _rev: 1 },
            'vibration': { _id: 'kljdfo2', _rev: 1 },
};
