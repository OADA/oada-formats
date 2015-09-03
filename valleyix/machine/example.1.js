'use strict';

module.exports = function(opts) {
  opts = opts || {};

  var _example = {
        configuration: { _id: 'qwe123', _rev: '1-kdjf02' },
               status: { _id: 'asd456', _rev: '4-k2g234gw02' },
              applied: { _id: 'zxc789', _rev: '2-svcwevws2' },
             vriZones: { _id: 'rty012', _rev: '1-kwg2g02' },
     vriPrescriptions: { _id: 'fgh345', _rev: '7-swedrg24g02' },
           workOrders: { _id: 'vbn678', _rev: '13-534nberv2302' },
  };

  for (var i in opts) {
    if (_example[i]) {
        _example[i] = opts[i]; // override any keys with value in opts:
    }
  }
  return _example;
};
