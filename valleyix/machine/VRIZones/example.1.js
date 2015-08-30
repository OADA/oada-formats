module.exports = function(opts) {
  opts = opts || {};

  var _example = {
    DeviceId: "F0FF610C-BF2A-4729-AEAD-1FA1C4BCEB2F",
    PivotLength: 500,
    PivotZones: [
      {
        CycleTime: 20,
        EndLength: 100,
        StartLength: 0,
        ZoneDisplayId: 1
      },
      {
        CycleTime: 20,
        EndLength: 300,
        StartLength: 100,
        ZoneDisplayId: 2
      },
      {
        CycleTime: 20,
        EndLength: 500,
        StartLength: 300,
        ZoneDisplayId: 3
      },
    ],
  }; 

  for (var i in opts) { 
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts:
  }       
  return _example;
};
