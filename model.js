var Promise = require('bluebird');
var _ = require('lodash');

// This map should map a given media type to the string necessary to
// pass to require to map that handler.  None of the required modules
// will be 'required' until somebody tries to make a model for a particular
// type using byShortMediaType or byMediaType.
var mediaTypeMap = {

  /////////////////////////////////////////////////////////////////////////////
  // Authorization/Authentication:
  //   - Client Registration
  'application/vnd.oada.oauth-dyn-reg.register-response.1+json': 'oada/oauth-dyn-reg/register-response.js',
  
  /////////////////////////////////////////////////////
  // Bookmarks:
  'application/vnd.oada.bookmarks.1+json': 'oada/bookmarks.js',

  /////////////////////////////////////////////////////
  // /.well-known/:
  'application/vnd.oada.well-known/oada-configuration.1+json': 'oada/well-known/oada-configuration.js',

};


var _OADAModel = {

  // byShortMediaType: use just the part of the media type that comes after the
  // 'application/vnd.oada.'
  byShortMediaType: function(short_type, opts) {
    return Promise.try(function() {
      _OADAModel.byMediaType('application/vnd.oada.' + short_type, opts);
    });
  },

  byMediaType: function(media_type, opts) {
    return Promise.try(function() {
      opts = opts || {};
      // If schema version does not exist, parse it from media type as last number prior to '+' at end:
      opts.version = opts.version || media_type.replace(/\.([0-9]+)\+/, '$1');
      var require_str = _.get(mediaTypeMap, media_type, null);
      if (!require_str) throw new Error('Could not find require string for media type ' + media_type);
      var handler = require(require_str);
      if (!handler) throw new Error('Could not require handler for media type ' + media_type);
      // Curry the handler to return a model with a particular version
      return handler(opts);
    });
  },

  /////////////////////////////////////////////////////////////////////////////
  // registerMediaType: adds proprietary media type handlers at run-time to 
  // the OADA-defined ones.  Note you can also override default ones with 
  // your own.
  registerMediaType: function(media_type, handler_require_path) {
    mediaTypeMap[media_type] = handler_require_path;
  },

  ////////////////////////////////////////////////////////////////////////
  // knownMediaTypes: returns the list of media type strings that are
  // present in the mediaTypeMap above.  Mainly for debugging/testing.
  knownMediaTypes: function() {
    return Promise.try(function() {
      return _.keys(mediaTypeMap);
    });
  },

};

module.exports = _OADAModel;
