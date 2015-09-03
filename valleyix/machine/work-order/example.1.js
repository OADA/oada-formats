'use strict';

module.exports = function(opts) {
  opts = opts || {};

  var _example = {
    orders: [
      {
        DeviceId: "137BB8A8-CB45-4BC9-A4A1-5CA097D1AC86",
        Command: "SetStoredProgramRun",
        ProgramSlotNumber: "1"
      },
      {
        DeviceId: "BF81F52D-5160-43FA-BBA7-785D31CC8B75",
        Command: "SetStoredProgramRun",
        ProgramSlotNumber: "1"
      },
      {
        DeviceId:"7FBBDB69-5E41-46B2-B75D-0DDC381651B8",
        Depth:"1",
        Direction:"Forward",
        SIS:"On",
        SISAngle:"180",
        Water:"On"
      },
      {
        DeviceId:"7FBBDB69-5E41-46B2-B75D-0DDC381651B8",
        SIS:"Off",
        Water:"Off"
      },
      {
        DeviceId:"7FBBDB69-5E41-46B2-B75D-0DDC381651B8",
        Aux1:"On",
        Aux2:"On",
        Depth:"1",
        Direction:"Forward",
        EndGun1:"On",
        EndGun2:"Off",
        SIS:"On",
        SISAngle:"180",
        Water:"On"
      },
      {
        DeviceId:"7FBBDB69-5E41-46B2-B75D-0DDC381651B8",
        Aux1:"Off",
        Aux2:"Off",
        SIS:"Off",
        Water:"Off"
      },
    ],
  };

  for (var i in opts) {
    if (_example[i]) {
        _example[i] = opts[i]; // override any keys with value in opts:
    }
  }
  return _example;
};
