var _Irrigation = {
  example: function() {
    return { 
      machines: { _id: 'dummyid123AFG', _rev: '1-dummy02ijfl' }
    };
  },

  validate: function() {
    throw new Error("validate: not implemented");
  },

};

module.exports = new _Irrigation();
