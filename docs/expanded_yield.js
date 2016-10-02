
// This is the top-level bookmarks:
vnd.oada.bookmarks.1+json:
{
  _id: '290fijklf3',
  _rev: '7-9ijkljf0j2ifkl3f',
  _type: 'application/vnd.oada.bookmarks.1+json',

  // The "harvest" key points to a resource which contains info
  // about harvest.  Obviously.  Things like maps, etc...
  harvest: {
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
      _type: 'application/vnd.oada.as-harvested.1+json',

      context: {
        harvest: 'as-harvested',
      },

      // Known as-harvested data types: yield-moisture-dataset
      'yield-moisture-dataset': {
        _id: '02ijfkl3k20ij3fsf',
        _rev: '5-kojf2203iokflwdfs',
        _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

        context: {
          'harvest': 'as-harvested',
          'as-harvested': 'yield-moisture-dataset',
        },

        'crop-index': {
          'soybeans': { _id: 'kjf20oij3lk', _rev: '4-kldjf20iofj3kl' },
          'corn': {
            _id: 'fj0o2i3jl3k2',
            _rev: '6-kldjf2io3lfke',
            _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

            context: {
              'harvest': 'as-harvested',
              'as-harvested': 'yield-moisture-dataset',
              'crop-index': 'corn',
            },

            'geohash-length-index': {
              // datum can either be a string (known strings: WGS84)
              // or an object to specify more detail as at http://spatialreference.org/ref/epsg/wgs-84/json/
              'datum': 'WGS84',
              'geohash-7': { 
                _id: 'lkdjf02ijfelw', 
                _rev: '4-kdfj20io3jflksd',
                _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

                context: {
                  'harvest': 'as-harvested',
                  'as-harvested': 'yield-moisture-dataset',
                  'crop-index': 'corn',
                  'geohash-length-index': 'geohash-7',
                },

                'geohash-index': {

                  '9jfk289': { _id: 'ifjo2ifkl23', _rev: '2-ihdofi223' },
                  '9jfk290': { _id: 'ifjo2ifkl23', _rev: '2-ihdofi223' },
                  '9jfk291': { _id: 'ifjo2ifkl23', _rev: '2-ihdofi223' },
                  '9jfk292': { 
                    _id: 'ifjo2ifkl23', 
                    _rev: '2-ihdofi223',
                    // The data in the tile and the original 'yield-moisture-dataset' document
                    // have the same type.  This is because a 'yield-moisture-dataset' document
                    // can either contain data directly, or an index (or set of indexes)
                    // to that data.  You can decide which by looking for the 'data' key:
                    // if present, there is data here.  If not, follow the index until
                    // you get to a 'data' key.
                    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

                    context: {
                      'harvest': 'as-harvested',
                      'as-harvested': 'yield-moisture-dataset',
                      'crop-index': 'corn',
                      'geohash-length-index': 'geohash-7',
                      'geohash-index': '9j9j12f',
                    },

                    // Templates are like object prototypes for data objects.  Any object which
                    // refers to one of these keys from 'templates' should be merged
                    // with that particular template object.  Provides a convenient way to not
                    // have to keep repeating things over and over in the data portion of the document.
                    templates: {
                      'k20ifkj': {
                        // Known list of crop types maintained at https://github.com/oada/oada-formats
                        'crop-type': 'corn',
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
                        // is optional, but if it is used then it should be a unique identifier
                        // within this cloud for this particular data point.
                        id: 'kdjf02ijk3f',
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
                        id: '0f2jflk2j3l',
                        template: 'k20ifkj',
                        time: { value: 192847323.78321 },
                        area: { value: '0.9' },
                        weight: { value: '2.3' },
                        moisture: { value: 23.81 },
                        location: { 
                          latitude: -41.9384931,
                          longitude: 80.9284921,
                          altitude: 200.49581,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
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
        _id: 
        _type: 'application/vnd.oada.tiled-maps.1+json',

        // Known map types: dry-yield-map and moisture-map.
        'moisture-map':  { _id: 'k2fjo23lf3', _rev: '10-0f2jo3ijf3' },

        // Here the dry-yield-map tiled-map is expanded to show an example of a tiled map:
        dry-yield-map: {
          _id: 'k2fjo23lf3',
          _rev: '9-9034i2f3n33f',
          // @instanceof application/vnd.oada.harvest.tiled-map.generic.1+json
          _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',

          // Context for a map includes the bookmarks link where the map sits,
          // and the map type which is the same as it's key in the maps list, 
          // in this case 'dry-yield-map'.  The total known set of map types will be listed
          // here, and formally defined in the schema.)
          context: { 
            'harvest': 'tiled-maps',
            'tiled-maps': 'dry-yield-map',
          },

          // Known list of crop-index keys at https://github.com/oada/oada-formats.
          // Since data for two different crop types is generally not combinable,
          // maps are organized under crop types.  Think of them as "layers".
          crop-index: {
            'soybeans': { _id: '092jf323d0', _rev: '2-ksdf0234f' },
            'corn': {
              _id: '02fj3klsdf',
              _rev: '3-jif20ijr32k',
              _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',

              context: {
                'harvest': 'tiled-maps',
                'tiled-maps': 'dry-yield-map',
                'crop-index': 'corn',
              },

              'geohash-length-index': {
                // the 'datum' key tells you which model was used for the lat/lon basis of the geohash
                // indexes.
                'datum': 'WGS84',
                // each of these indices can be pretty good sized, so each index listing
                // at a particular level is it's own resource.
                'geohash-3': { _id: '9i02jfo302', _rev: '5-kldjf0o2ijfl' },
                'geohash-4': { _id: '9i02jfo302', _rev: '3-kldfjo2ijo3f' },
                'geohash-5': {
                  _id: '9i02jfo302',
                  _type: 'application/vnd.oada.data-index.geohash.1+json',
                  context: {
                    'harvest': 'tiled-maps',
                    'tiled-maps': 'dry-yield-map',
                    'crop-index': 'corn',
                    'geohash-length-index': 'geohash-5',
                  },
                  'geohash-index': {
                    '39jd8': { _id: 'kjf02jiflk3', _rev: '1-fkj203fhjwkfwlef' },
                    '39jd9': { _id: 'kjf02jiflk3', _rev: '3-fjk32fj3ljlflkff' },
                    '39j89': { _id: 'kjf02jiflk3', _rev: '2-kl209f23jlkjasfo' },
                    '39jk7': { 
                      _id: 'kjf02jiflk3',
                      _rev: '4-980h2of23joifl23kf',
                      _type: 'application/vnd.oada.tiled-maps.dry-yield-map.1+json',
                      context: {
                        'harvest': 'tiled-maps',
                        'tiled-maps': 'dry-yield-map',
                        'crop-index': 'corn',
                        'geohash-length-index': 'geohash-5',
                        'geohash-index': '39jk7',
                      },
                      // Datum describes the earth model used for the GPS coordinates in 
                      // the geohashes.  It also exists at the index level: you can't
                      // mix-and-match datums in a geohash index.
                      datum: 'WGS84',
                      // stats holds sum/count information representing the data points in
                      // this document.
                      stats: {
                        geohash: { value: '39jk7', },
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
                          geohash: { datum: 'WGS84' },
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
                    },

                    // 'geohash-data' means the keys in the object are geohashes
                    // rather than random strings (like the normal "data" key).
                    // Other than that it looks just like "data" from the 
                    // as-harvested/yield-moisture-dataset document, except the values
                    // are sum/count of weight/area values instead of the raw data.
                    'geohash-data': {

                      '023jf2d': {
                        template: '123',
                        geohash: '023jf2d',
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
          },
        },
      }, // /bookmarks/harvest/tiled-maps
    },   // /bookmarks/harvest/as-harvested
  },     // /bookmarks/harvest
}        // /bookmarks

