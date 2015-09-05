// application/vnd.oada.user.1+json
module.exports = function(opts) {
  opts = opts || {};
  var _example = {
    bookmarks: { _id: 'kdjsl028ifej', _rev: '2-djfh92843hj' },
  };
  for (var i in opts) {
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts:
  }
  return _example;
};
