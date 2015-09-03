[![Build Status](https://travis-ci.org/OADA/oada-formats.svg?branch=master)](https://travis-ci.org/OADA/oada-formats)
[![Coverage Status](https://coveralls.io/repos/OADA/oada-formats/badge.svg?branch=master)](https://coveralls.io/r/OADA/oada-formats?branch=master)
[![Dependency Status](https://david-dm.org/oada/oada-formats.svg)](https://david-dm.org/oada/oada-formats)
[![License](http://img.shields.io/:license-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

# oada-formats #
This repo contains models for all formats whose format is known from a given
media type.  Each "model" consists of a module with a "validate()" function and
an "example()" function.

You can require 'model.js' to get a factory with a require() function that,
given a mediaType, will return you a valid model object for that media type
(i.e. something that has example() and validate()).

There are three places that model.js uses to search for the correct module:
1.  `.registerCustomMediatype`: if you have registered a custom
    mediatype-to-require-path at runtime, it will require that path for the
    given media type.
2.  `index.js`: it will next strip off the `application/vnd.` from the media
    type, convert the '.' in what remains to a path, and look for `index.js` at
    that path.  If that file exists, it will require() it.  Example:
    `application/vnd.oada.bookmarks.1+json` --> `./oada/bookmarks/index.js`.
3.  Finally, if neither 1 nor 2 succeeded, it will check for the same path as 2,
    but for just the example.1.js and schema.1.js files (or any version).  It
    will pass those files to a default handler and return the default handler.

## Installation ##
```shell
npm install oada-formats
```

## Usage ##
```javascript
var oadaFormats = require('oada-formats')(config);
```
NOTE: the config is optional.  The only part of config that is used, if passed,
is config.libs.log().  If you want to log errors, pass in a logger at
config.libs.log().
