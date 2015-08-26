[![Build Status](https://travis-ci.org/OADA/oada-formats.svg?branch=master)](https://travis-ci.org/OADA/oada-formats)
[![Coverage Status](https://coveralls.io/repos/OADA/oada-formats/badge.svg?branch=master)](https://coveralls.io/r/OADA/oada-formats?branch=master)
[![Dependency Status](https://david-dm.org/oada/oada-formats.svg)](https://david-dm.org/oada/oada-formats)
[![License](http://img.shields.io/:license-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

# oada-formats #
This repo contains models for all formats whose format is known from a given media type.  
Each "model" consists of a module with a "validate()" function, an "example()" function, 
and optionally a schema (in JSON schema).

The main "model.js" file contains mappings from media type to the required module for that
media type.

## Installation ##
```shell
npm install oada-formats
```

## Usage ##
```javascript
var oadaFormats = require('oada-formats');
```
