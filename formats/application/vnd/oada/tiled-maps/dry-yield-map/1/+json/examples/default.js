{
  _id: 'k2fjo23lf3',
  _rev: '9-9034i2f3n33f',
  _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',

  // All OADA-designed resources have the context key to describe the
  // type of data in this resource as well as indexing contraints used
  // to limit the actual data in this resource.  In this example,
  // this tile is indexed under both a crop-type and a 5-character geohash.  
  // This means that this resource contains data for corn whose GPS coordinates
  // fall within the geohash '39jk7'.

  context: {
    // required keys:
    'harvest': 'tiled-maps',
    'tiled-maps': 'dry-yield-map',

    // optional keys based on indexing scheme that determined
    // which data is included in this tile:
    'crop-index': 'corn',
    'geohash-length-index': 'geohash-5',
    'geohash-index': '39jk7'
  },

  // stats holds sum/count information representing the data points in
  // this document.
  stats: {
    weight: {
      units: 'bushels',
      sum: 123123.4124,
      'sum-of-squares': 1412413.234234,
      count: 1243,
    },
    area: {
      units: 'acres',
      sum: 1451341.34233,
      'sum-of-squares': 134134124.3413412,
      count: 1243,
    },
  },
  templates: {
    '123': {
      // known units for area: ac, ha, or valid UUCM units
      area: { units: 'ac', },
      // known units for weight: bu, bushels, lbs, kg, or valid UUCM unit
      weight: { units: 'bu' },
      // known units for moisture: %H2O or valid UUCM unit
      moisture: { 
        value: 15.0,
        units: '%H2O',
      },
    },
  },

  // Since this document contains geohash-data instead of data 
  // (i.e. the keys for the data points are geohash strings instead
  // of random strings), you need to say which model of the earth
  // was used to come up with the underlying GPS coordinates used for 
  // the geohashes in geohash-data.
  datum: 'WGS84',

  // 'geohash-data' means the keys in the object are geohashes
  // rather than random strings (like the normal "data" key).
  // Other than that it looks just like "data" from the 
  // as-harvested/yield-moisture document, except the values
  // are sum/count of weight/area values instead of the raw data values.
  // 
  // Notice that each data point ends up being exactly the same as the 
  // 'stats' object above.  A nice feature of geohashes is that this tile
  // (identified by a 5-character geohash) simply contains the stats from
  // a geohash 2 characters smaller (7-character geohashes).  This size
  // differential seems to produce reasonably-sized tiles.  Note that you
  // only should include geohash strings here which actually contain
  // data.  Absence of a known geohash string simply means there is 
  // no data there.
  geohash-data: {

    // The string keys under geohash-data are geohashes
    '023jf2d': {
      // deep merge this object with templates['123']
      template: '123',
      // which geohash goes with this weight and area.  Same as key.
      geohash: '023jf2d',
      // stats for weight of crop harvested in this tile.  Units above in
      // the template.
      weight: {
        sum: 123123.4124,
        'sum-of-squares': 1412413.234234,
        count: 1243,
      },
      // stats for area harvested in this tile.  Units above in the template.
      area: {
        sum: 1451341.34233,
        'sum-of-squares': 134134124.3413412,
        count: 1243,
      },
    },

    // Example data point for a different geohash.
    '023jf2e': {
    template: '123',
    geohash: '023jf2e',
    weight: {
      sum: 123123.4124,
      'sum-of-squares': 1412413.234234,
      count: 1243,
    },
    area: {
      sum: 1451341.34233,
      'sum-of-squares': 134134124.3413412,
      count: 1243,
    },
  },
},
        },
      },
    },
  },
}
