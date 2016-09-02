{
  // Refer to vnd.oada.sensor-data.generic.1+json for details on this
  // format.
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.location.1+json',

  dataType: {
    definition: 'https://github.com/oada-formats',
    name: 'location',
  },

  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' }, // this means these are the locations associated with this hub
  },

  templates: {
    '1': {
      sensor: { _id: 'i02ijf2i3o23' }, // this is a link to info about the GPS sensor itself
      subject: { _id: '9f84u9f' }, // this is a link to the "thing" that the location goes with
                                   // in this case, it is linking to a sensor-hub.
      units: {
        datum: 'WGS84',
      },
    },
    '2': {
      sensor: { _id: '92fjkljf2309' }, // this is a link to info about the GPS sensor itself
      subject: { _id: 'd0f2hfhhf9qh23233' }, // this is a link to the "thing" that the location goes with
                                             // in this case, it is linking to an individual sensor
      units: {
        datum: 'WGS84',
      },
    }

  },

  data: {
    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3',
      template: '1',
      time: 1456376029.293843,
      value: {
        latitude: -40.0902384932,
        longitude: 83.920938432,
        altitude: 200.902384023,
        // as with all location objects, 'geojson' is also a valid key inside a location
        // if needed.
      },
    },
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '2',
      time: 1456376030.90398423,
      value: {
        latitude: -41.5902384932,
        longitude: 83.920938432,
        altitude: 200.902384023,
      },

    },
    'e2jr2039fijlfjwlefwlke': {
      id: 'e2jr2039fijlfjwlefwlke',
      template: '1',
      time: 1456376031.90398423',
      value: {
        latitude: -41.0902384932,
        longitude: 83.920938432,
        altitude: 200.902384023,
      },

    },
  },

}
