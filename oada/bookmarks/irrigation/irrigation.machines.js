var _IrrigationMachines = {
  example: function() {
    return { 
      name: 'Irrigation Machines',
      list: {
        'dummyrandomidfe2jk': { _id: 'dummyid123AFG', _rev: '1-dummy02ijfl' },
      },
    };
  },

  validate: function() {
    throw new Error("validate: not implemented");
  },

};

module.exports = new _IrrigationMachines();
