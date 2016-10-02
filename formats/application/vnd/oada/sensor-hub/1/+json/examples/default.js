module.exports = {
  _id: '9f84u9f',
  _rev: '2-kd0ijf3',
  _meta: { '_metaid': '9f84u9f', '_rev': '5-lj0i2kld' },
  _type: 'application/vnd.oada.sensor-hub.1+json',

  // All keys in this document are optional

  name: 'Smith Irrigator Pivot Hub',

  context: {
    'client': { _id: 'k0dj2flkjsdf' }, // if this hub is associated with a client, link back to the client here
  },

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
    '902jf3k23': { _id: '9023fj20', _rev: '3-kdjfo03i4e' },
  },

  // The data captured by the sensors that are connected to this 
  // hub is organized under the keys below.  Note that since 
  // 'location' is a special type of data that is really an identifier
  // for other types of data, it should be listed either in the 'location'
  // key above, in a 'location' key under an individual sensor, or under
  // a 'location' key according to the sensor-data schemas.
  data: {
        'air-temperature': { _id: '8f02jkl', _rev: '1-idjf02ojl' },
          'soil-moisture': { _id: 'kdjf092', _rev: '1-idjf02ojl' },
       'soil-temperature': { _id: '92kfjl2', _rev: '1-idjf02ojl' },
    'barometric-pressure': { _id: 'dmkgf39', _rev: '1-idjf02ojl' },
              'dew-point': { _id: 'qoakldj', _rev: '1-idjf02ojl' },
      'relative-humidity': { _id: 'kejf902', _rev: '1-idjf02ojl' },
             // Note: wind-speed will have average and max under it
             'wind-speed': { _id: 'kdw00w0', _rev: '1-idjf02ojl' },
             // Note: wind-direction will have average and max under it
         'wind-direction': { _id: 'iiifjwl', _rev: '1-idjf02ojl' },
            'cloud-cover': { _id: '19139jf', _rev: '1-idjf02ojl' },
        'solar-radiation': { _id: '555ikdf', _rev: '1-idjf02ojl' },
               'rainfall': { _id: 'kljdfo2', _rev: '1-kdjo2flds' },
  }
}
