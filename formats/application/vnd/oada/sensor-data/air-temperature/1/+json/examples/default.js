module.exports = {
  // Refer to vnd.oada.sensor-data.generic.1+json for details on this
  // format.
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.air-temperature.1+json',

  dataType: {
    definition: 'https://github.com/oada-formats',
    name: 'air-temperature'
  },

  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' },
  },

  templates: {
    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: 'Cel',
      location: {
         latitude: -40.9384920342,
         longitude: 80.9308242934,
         altitude: 204.93084234,
      },
    },
  },

  data: {
    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3',
      template: '1',
      time: 1456376029.293843, 
      value: 30.902938,
    },
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '1',
      time: 1456376030.90398423,
      value: 32.90398423,
    },
    '20dkfj203jwefjlkfj0293i': {
      id: '20dkfj203jwefjlkfj0293i',
      template: '1',
      time: 1456376031.90398423,
      value: 31.90398423,
    },
  },

}
