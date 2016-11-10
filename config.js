// Eliminating the original nconf here so it can compile to browser.

var config = {
  strict: false;
};

module.exports = {
  // adding 'get' for nconf compatibility in case we switch back later
  get: function(key) {
    return config[key];
  },
};


/*
var nconf = require('nconf');

// you can do strict checks with --strict=true

nconf.set('strict', false);

nconf
  .argv()
  .env();

module.exports = nconf;
*/
