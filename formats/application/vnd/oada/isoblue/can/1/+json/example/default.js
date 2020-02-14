module.exports = {
    _type: 'application/vnd.oada.isoblue.can.1+json',
  
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
        time: 123456,
        is_error_frame: false,
        is_extended_frame: false,
        arbitration_id: 1234,
        dlc: 1234,
        payload: 'AQIDBAUGBwgJCgsMDQ4P',
        is_remote_frame: false
      },
    },
  
    data: {
      afdniji12non: {
        time: 123456,
        is_error_frame: false,
        is_extended_frame: false,
        arbitration_id: 1234,
        dlc: 1234,
        payload: 'AQIDBAUGBwgJCgsMDQ4P',
        is_remote_frame: false
      },
      jnbj31knpo3i: {
        time: 7891011,
        is_error_frame: false,
        is_extended_frame: true,
        arbitration_id: 9876,
        dlc: 54321,
        payload: '//79/Pv6',
        is_remote_frame: 0
      },
    }
}
  