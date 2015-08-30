module.exports = function(opts) {
  opts = opts || {};
  var _example = {
    machines: { _id: 'dummyid123AFG', _rev: '1-dummy02ijfl' },
  };
  for (var i in opts) {
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts:
  }
  return _example;
};
