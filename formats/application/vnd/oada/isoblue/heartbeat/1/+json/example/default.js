module.exports = {
    _type: 'application/vnd.oada.isoblue.heartbeat.1+json',
  
    indexing: [
      {
        name: 'year-index',
        source: 'oada.vocab.year-index',
        value: '2019',
      },
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
    template: {
      '1':{
        time: { units: 'unix-timestamp',},
        cell_ns: { units: 'dBm',},
        wifi_ns: { units: 'dBm',},
        backlog: { units: 'count',},
      },
    },


    data: {
        'ghuenwpmrm': {
          id: 'ghuenwpmrm',
          template: '1',
          time: {value: 1574107208.016281},
          cell_ns: {value: -79},
          wifi_ns: {value: -70},
          backlog: {value: 311536},
          netled: 1,
          statled: 1,
        },
        'acd4nn6eaf': {
          id: 'acd4nn6eaf',
          template: '1',
          time: {value: 1574107238.016302},
          cell_ns: {value: -79},
          wifi_ns: {value: -70},
          backlog: {value: 308537},
          netled: 1,
          statled: 1
        },
    }
}
