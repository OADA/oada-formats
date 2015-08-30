// application/vnd.oada.bookmarks.1+json
module.exports = function(opts) {
  opts = opts || {};
  var _example = {
     planting: { _id: '09ijfofj', _rev: '2-djfh92843hj' },
      harvest: { _id: '908uf2jh', _rev: '33-kdfj092jle' },
     machines: { _id: '0kdfj20j', _rev: '8-kdjs90fj2oi' },
   irrigation: { _id: '0jk2iopw', _rev: '4-d98ohf29efk' },
        sales: { _id: '0kdfj20j', _rev: '99-kdjf92lsdf' },
      sensors: { _id: 'kd02ufjk', _rev: '3-kdsfjoiwefj' },
       fields: { _id: '0kdfj2jl', _rev: '7-kk0all2oald' },
      clients: { _id: '9sdkf2lk', _rev: '4-lfdu029kjds' },
  };
  for (var i in opts) {
    if (_example[i]) _example[i] = opts[i]; // override any keys with value in opts:
  }
  return _example;
};
