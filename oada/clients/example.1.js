module.exports = function(opts) {
  opts = opts || {};
  var _example = {
    name: 'clients',
    list: {
      '0jfl290ijfklwsdf': { _id: '321cba', _rev: '90-k2983wfhjdsdf' },
      'kl9ojksfh92hkwef': { _id: '389dfj', _rev: '2-kdfj29eflwdfsd' },
    },
  };
  for (var i in opts) {
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts
  }
  return _example;
};
