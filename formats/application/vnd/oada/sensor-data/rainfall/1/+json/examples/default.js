module.exports = {
  _type: 'application/vnd.oada.sensor-data.rainfall.1+json',

  indexing: [
    { 
      name: 'day-index',
      source: 'oada.vocab.day-index',
      value: '2019-05-04',
    },
    {
      name: 'hour-index',
      source: 'oada.vocab.hour-index',
      value: '22:00',
    },
  ],

  templates: {
    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: 'm', // SI units
      rate: {
        units: 'm/s',
      },
    },
  },

  // Samples are incuded in this time window based on their start time
  data: {

    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3',
      template: '1',
      'time-start': 1456376029.293843,
      'time-end': 1456376030.293843,
      // You don't have to have both max and mean in the same sample, but you 
      // can if they share the same time window.  Can also have min, std.
      value: 0.0834, // amount of rainfall recorded in this window
      rate: {
        max: 10.902938, // maximum rate of rainfal recorded in this window
      },
      'is-freezing': true, // true/false if rain is freezing or frozen during window
    },

  },

}
