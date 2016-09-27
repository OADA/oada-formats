var nconf = require('nconf');

// you can do strict checks with --strict=true

nconf.set('strict', false);

nconf
  .argv()
  .env();

module.exports = nconf;
