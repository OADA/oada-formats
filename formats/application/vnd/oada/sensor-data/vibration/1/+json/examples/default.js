{
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.vibration.1+json',

  dataType: {
    definition: 'https://github.com/oada-formats',
    name: 'vibration',
  },

  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' },
  },

  templates: {

    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: '[quantization]',
      quantization: {
        units: 'Hz',
        levels: [
          {
            start: '-Inf',
            end: 25.0,
            value: 'on',
          },
          {
            // lack of 'start' key implies this level picks up where previous left off
            end: 'Inf',
            value: 'off',
          },
        ],
      },
    },

  },

  data: {
    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3',
      template: '1',
      time: 1456376029.293843, 
      value: 'on',
    },
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '1',
      time: 1456376030.90398423,
      value: 'off',
    },
    'k209j2o3if2jlkwdf02': {
      id: 'k209j2o3if2jlkwdf02',
      template: '1',
      time: 1456376031.90398423,
      value: 'on'
    },
  },

}
