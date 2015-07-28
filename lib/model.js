
// This map should map a given media type to the string necessary to
// pass to require to map that handler.  None of the required modules
// will be 'required' until somebody tries to make a model for a particular
// type using byShortMediaType or byMediaType.
var mediaTypeMap = {

  /////////////////////////////////////////////////////////////////////////////
  // Irrigation:
           "application/vnd.oada.irrigation": './oada/irrigation/irrigation.js',
  "application/vnd.oada.irrigation.machines": './oada/irrigation/irrigation.machines.js',
  
  /////////////////////////////////////////////////////
  // Other:
            "application/vnd.oada.bookmarks": 'oada/other/bookmarks.js',
   "application/vnd.oada.oada-configuration": 'oada/other/oada-configuration.js',

};


var _OADAModel = {

  // byShortMediaType: use just the part of the media type that comes after the
  // 'application/vnd.oada.'
  byShortMediaType: function(short_type) {
    return _OADAModel.byMediaType('application/vnd.oada.' + short_type);
  },

  byMediaType: function(media_type) {
    var require_str = _.get(mediaTypeMap, media_type, null);
    if (!require_str) throw new Error("Could not find require string for media type " + media_type);
    var handler = require(require_str);
    if (!handler) throw new Error("Could not require handler for media type " + media_type);
    return handler;
  },

  /////////////////////////////////////////////////////////////////////////////
  // registerMediaType: adds proprietary media type handlers at run-time to 
  // the OADA-defined ones.  Note you can also override default ones with 
  // your own.
  registerMediaType: function(media_type, handler) {
    mediaTypeMap[media_type] = handler;
  },

  ////////////////////////////////////////////////////////////////////////
  // knownMediaTypes: returns the list of media type strings that are
  // present in the mediaTypeMap above.  Mainly for debugging/testing.
  knownMediaTypes: function() {
    return _.keys(mediaTypeMap);
  },

};

module.exports = _OADAModel;
