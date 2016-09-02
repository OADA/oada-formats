{
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.rainfall.1+json',

  dataType: {
    definition: 'https://github.com/oada-formats',
    name: 'rainfall',
  },

  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' },
  },

  templates: {
    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: 'm', // SI units
      rate: {
        units: 'm/s',
      },
    },
  },

  // Samples are incuded in this timehash based on their start time
  // Wind speeds are generally statistics over a time window, so 
  // data samples with have time-start/time-end/max/mean rather than
  // time/value.
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
      freezing: true, // true/false if rain is freezing or frozen during window
    },

  },

}
