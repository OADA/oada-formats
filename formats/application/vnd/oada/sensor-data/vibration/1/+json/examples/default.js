module.exports = {
  _type: 'application/vnd.oada.sensor-data.vibration.1+json',

  templates: {

    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: '[quantization]',
      quantization: {
        units: 'Hz',
        'quantization-levels': [
          {
            start: '-Inf',
            end: 25.0,
          },
          {
            // lack of 'start' key implies this level picks up where previous left off
            end: 'Inf',
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
      value: 0, // item 0 in quantization-levels array from template because "units" in template is "[quantization]"
    },
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '1',
      time: 1456376030.90398423,
      value: 1, // item 1 in array from template
    },
    'k209j2o3if2jlkwdf02': {
      id: 'k209j2o3if2jlkwdf02',
      template: '1',
      time: 1456376031.90398423,
      value: 0, // item 0 in array from template
    },
  },

}
