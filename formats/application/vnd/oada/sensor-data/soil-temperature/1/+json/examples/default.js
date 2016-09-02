{
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.soil-temperature.1+json',

  dataType: {
    definition: 'https://github.com/oada-formats',
    name: 'soil-temperature',
  },

  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' },
  },

  templates: {
    '1': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: 'Cel',
      depth: { // all samples below using template 1 are at depth 0.3m
        units: 'm',
        value: 0.3,
      },
    },
  },

  data: {
    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3',
      template: '1',
      time: 1456376029.293843, 
      value: 10.902938,
    },
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '1',
      time: 1456376030.90398423,
      value: 10.90398423,
    },
    'k209j2o3if2jlkwdf02': {
      id: 'k209j2o3if2jlkwdf02',
      template: '1',
      time: 1456376031.90398423,
      value: 10.90399323,
    },
  },

}
