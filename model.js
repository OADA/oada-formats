var Promise = require('bluebird');
var _ = require('lodash');

// The object below should map a given media type to the string necessary to
// pass to require for it's handler.  None of the required modules
// will be 'required' until somebody tries to make a model for a particular
// type using byShortMediaType or byMediaType.  You can register these
// at runtime using registerCustomMediaType
var media_type_map = {
  // 'some-mediatype': 'require/path/to/that/media/type.js',
};

///////////////////////////////////////////////////////////////////////////////////
// HOW TO USE THIS:
// var factory = require('factory.js')(config); // or require('oada-formats')(config) if using NPM module
// var bookmarks_model = factory.require({ _mediaType: 'application/vnd.oada.bookmarks.1+json' });
// bookmarks_model.validate(bookmarks_model.example());

var singleton = null;
module.exports = function(config) {
  if (singleton) return singleton;

  // Use a log with debug() and error() functions if defined in the config
  var log = {  
    debug: function() {}, 
    error: function() {}, 
  };
  if (_.has(config, 'libs.log')) {
    log = config.libs.log();
    if (log.child) { log = log.child({ module: 'oada-formats' }); }
  }


  ////////////////////////////////////////////////////////////////////////
  // The main factory object:
  ////////////////////////////////////////////////////////////////////////

  var _ModelFactory = {


    /////////////////////////////////////////////////////////////////////////
    // require: returns a model handler based on the media type in opts
    // opts = {
    //   _mediaType: 'application/vnd.oada.bookmarks.1+json',
    //   and_any: 'custom options for a specific handler', // don't actually use the key 'and_any'
    // }
    require: function(opts) {
      opts = opts || {};
      if (typeof opts._mediaType !== 'string') {
        log.error('require: No valid _mediaType ('+opts._mediaType+') passed in options.');
        return null;
      }
    
      // Check if media type exists in the custom media type map:
      log.debug('require: checking for custom path for mediaType: ', opts._mediaType);
      var custom_override_require = _.get(media_type_map, opts._mediaType, null);
      if (custom_override_require) {
        try {
          var handler = require('./' + custom_override_require);
          if (typeof handler !== 'function') {
            log.error('require: Returned value from custom require('+custom_override_require+') is not a function!');
            return null;
          }
          log.debug('require: successfully found and required custom path');
          return handler(opts);
        } catch(e) { 
          log.error('require: require failed to find path ' + custom_override_require);
          return null;
        }
      }
  
      // Otherwise, attempt the automatic discovery of a custom-coded index.js file:
      var predicted_path = _ModelFactory.predictRequirePathFromMediaType(opts._mediaType);
      log.debug('require: no custom path, checking for custom index.js at predicted path ' + predicted_path);
      try {
        var handler = require(predicted_path + '/index.js');
        if (typeof handler === 'function') {
          log.debug('require: successfully found and required custom index.js at predicted path ' + predicted_path + '/index.js');
          return handler(opts);
        }
      } catch(e) { }

      // If we get here, the custom index.js did not exist, so next try to make a default
      // handler with the example and schema files
      log.debug('require: no custom index.js, final attempt: checking if we can make a default handler with example and schema files');
      var handler = _ModelFactory.defaultHandler(opts);
      if (handler) {
        log.debug('require: succeeded at creating default handler for media type ' + opts._mediaType);
        return handler;
      }

      // If we get here, all attempts at finding a handler failed.
      log.error('require: could not find model for media type ' + opts._mediaType);
      return null;
    },


    ////////////////////////////////////////////////////////////////////////
    // defaultHandler: returns a model object (with example() and validate())
    // based on predicting the locations of the example and schema files
    // from the mediaType.  You should probably just use require() above
    // outside of this file, rather than this function, unless you have
    // a good reason not to.  
    // opts = same as _ModelFactory.require(opts)
    defaultHandler: function(opts) {
      var schema = opts.schema || _ModelFactory.filePathWithExtensions('schema', opts);
      var example = opts.example || _ModelFactory.filePathWithExtensions('example', opts);
      log.debug('defaultHandler: schema = ', schema, ', example = ', example);

      // The Main "model" object:
      var ret = {
        // example should be a function that returns an object
        example: false,

        // schema is not required for a model, but this forces evaluation 
        // of require now rather than when you call validate() later, which
        // means it will fail if the predicted schema path doesn't exist.
        schema: false,

        // validate: SHOULD RETURN A PROMISE THAT RESOLVES TO TRUE OR FALSE
        validate: function(obj, opts) {
          return Promise.try(function() {
            var schema = this.schema;
            if (!schema) return false; // no schema === invalid
            // If you make your schema file return a function that generates a schema, 
            // we'll call that function with the options from validate() at run-time 
            if (typeof schema === 'function') {
              schema = schema(opts);
            }
            // TODO: use a json-schema validator here
          });
        },
      };

      // Try to require the example:
      try {
        ret.example = require(example);
      } catch(e) {
        log.debug('defaultHandler: unable to require example '+example);
        ret.example = false;
      }
      // Try to require the schema:
      try {
        ret.schema = require(schema);
      } catch(e) {
        log.debug('defaultHandler: unable to require schema '+schema);
        ret.schema = false;
      }

      // If we got either an example or a schema at our predicted path, consider it
      // a success.
      if (ret.example || ret.schema) {
        return ret;
      }

      log.debug('defaultHandler: unable to find example ('+example+') and schema ('+schema+') files to build handler.');
      return null; 
    },


    /////////////////////////////////////////////////////////////////////////
    // Helpful functions for parsing media type strings:
    // Example: application/vnd.oada.bookmarks.1+json will resolve to './oada/bookmarks'.
    predictRequirePathFromMediaType: function(mediatype) {
      mediatype = mediatype || '';
      return './' + mediatype
        .replace(/^application\/vnd\./,'') // get rid of 'application/vnd.' if present
        .replace(/\.[0-9]+\+.*$/, '')      // get rid of '.1+json' if present
        .replace(/\./g, '/');               // replace all '.' with '/' to get a path
    },

    versionFromMediaType: function(mediatype) {
      mediatype = mediatype || '';
      var version = mediatype
        .replace(/^[^0-9]*/, '')   // get rid of everything up to first number
        .replace(/\+.*$/, '')      // get rid of '+json' if present
      if (!version.match(/^([0-9\.])+/)) return null; // can only be '1' or '1.2', etc.
      return version;
    },

    filePathWithExtensions: function(filename, opts) {
      var path = _ModelFactory.predictRequirePathFromMediaType(opts._mediaType);
      path += '/' + filename; // path += '/schema' or '/example'
      var version = _ModelFactory.versionFromMediaType(opts._mediaType);
      if (version) {
        path += '.' + version; // schema.1
      }
      // For now, all schema and example files are .js extensions. Can certainly 
      // fix this later for other types.
      path += '.js';  // schema.js or schema.1.js
      return path;
    },

  
    /////////////////////////////////////////////////////////////////////////////
    // registerMediaType: adds proprietary media type handlers at run-time to
    // the OADA-defined ones.  Note you can also override default ones with
    // your own.
    registerCustomMediaType: function(mediaType, handler_require_path) {
      mediaTypeMap[mediaType] = handler_require_path;
    },
 

    ////////////////////////////////////////////////////////////////////////
    // knownCustomMediaTypes: returns the list of media type strings that are
    // present in the mediaTypeMap above.  Mainly for debugging/testing.
    knownCustomMediaTypes: function() {
      return _.keys(mediaTypeMap);
    },
  
  };

  singleton = _ModelFactory;
  return singleton;
};  
