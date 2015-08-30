module.exports = function(opts) {
  opts = opts || {};

  var _example = {
    name: 'irrigators',
    list: {
      'dummyrandomthing': { _id: 'dummyid123AFG', _rev: '1-dummy02ijfl' },
      'klsdfj0982ifjoow': { _id: 'df002jfk2ojsl', _rev: '3-jkfd0ijs8zk' },
    },
  };

  for (var i in opts) {
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts:
  }
  return _example;
};

