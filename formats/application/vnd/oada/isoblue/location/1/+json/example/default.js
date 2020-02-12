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
  
    templates: {
      '1': {
        time: 1574107208.016281,
        cell_ns: -79,
        wifi_ns: -70,
        backlog: 311536,
        netled: 1,
        statled: 1
      },
    },
  
    key: {
        ghuenwpmrm: {
          time: 1574107208.016281,
          cell_ns: -79,
          wifi_ns: -70,
          backlog: 311536,
          netled: 1,
          statled: 1
        },
        acd4nn6eaf: {
          time: 1574107238.016302,
          cell_ns: -79,
          wifi_ns: -70,
          backlog: 308537,
          netled: 1,
          statled: 1
        },
    }
}
