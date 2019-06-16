/* Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var _ = require('lodash');
var debug = require('debug');
var Promise = require('bluebird');
require('extend-error');



module.exports = Formats;
var Model = require('./model');
module.exports.Model = Model;

var MediaTypeNotFoundError = Error.extend('MediaTypeNotFoundError');
module.exports.MediaTypeNotFoundError = MediaTypeNotFoundError;
var ModelTypeNotFoundError = Error.extend('ModelTypeNotFoundError');
module.exports.ModelTypeNotFoundError = ModelTypeNotFoundError;
var ModelTypeFailedToLoadError = Error.extend('ModelTypeFailedToLoadError');
module.exports.ModelTypeFailedToLoadError = ModelTypeFailedToLoadError;

/**
 * Maintains and builds OADA format models
 * @constructor
 * @param {object} options - Various optional options
 * @param {function} options.debug - A custom debug logger, debug.js interface
 * @param {function} options.error - A custom error logger, debug.js interface
 */
function Formats(options) {
    options = options || {};

    this.debugConstructor = options.debug || debug;
    this.debug = this.debugConstructor('oada:formats');
    this.errorConstructor = options.error || debug;
    this.error = this.errorConstructor('oada:formats:error');

    this.Model = Model;

    this.models = {};
    this.mediatypes = {};

    // Add the built in models
    this.use(require('./JsonModel'));

    // Add the built in media types
    this.use(require('./formats/index.js'));
}

Formats.ValidationError = Model.ValidationError;
Formats.InvalidSchemaError = Model.InvalidSchemaError;
Formats.SchemaMismatch = Model.SchemaMismatch;


/**
 * Factory function for a media type model.
 * Tries to lookup and load the media type's sub-moudle and adds it to the Model
 * class before returning it. It is assumed the sub-model return sa promise or
 * an object of promises.
 * @param {string} mediatype - The media type of model being requested
 * @returns {Promise<Model>}
 */
Formats.prototype.model = function model(mediatype) {
    this.debug('Trying to load ' + mediatype);

    mediatype = mediatype.toLowerCase();

    return Promise
        .bind(this)
        .then(function() {
            // Load model package
            return require(this.mediatypes[mediatype]);
        })
        .props()
        .then(function(pack) {
            // Store the path for the Model subclasses
            // TODO: Can I get rid of this somehow????
            pack._path = this.mediatypes[mediatype];

            var m;
            if (pack && pack.validator) {
                // If package specifies a validator, use it
                m = this.models[pack.validator];
            } else {
                // Otherwise, try to guess from the mediatype suffix
                var suffix = mediatype.match(/[^+]*$/)[0];

                m = suffix && this.models[suffix];
            }

            if (!m) {
                throw new ModelTypeNotFoundError(mediatype);
            }

            return [pack, m];

        })
        .spread(function(pack, m) {
            return m.fromPackage(pack, {
                debug: this.debugConstructor,
                error: this.errorConstructor
            });
        })
        .catch(function(e) {
            if (e.name === 'ModelTypeNotFoundError') {
                this.error('Model type for ' + mediatype + ' not found');
                this.debug(e);
                throw e;
            } else {
                this.error('Mediatype ' + mediatype + ' model failed to load. Error = ', e);
                this.debug(e);

                var error = new ModelTypeFailedToLoadError (mediatype);
                error.e = e;
                throw error;
            }
        });
};

/**
 * Internal function for plugins to add to the Mediatype map.
 * @param {object} mediatype - Key: mediatype, Value: path to package
 */
Formats.prototype._addMediatypes = function _addMediatypes(mediatypes) {
    // Warn about conflicts
    var conflicts = _.intersection(Object.keys(this.mediatypes),
                                   Object.keys(mediatypes));

    conflicts.forEach(function(mediatype) {
        this.debug('Overriding existing mediatype: ' + mediatype);
    }, this);

    _.assign(this.mediatypes, mediatypes);
};

/**
 * Internal function for plugins to add model types
 * @param {string} name - Name of model (suffix and used as validator key value)
 * @param {object} model - The model constructor
 */
Formats.prototype._addModel = function _addModel(name, model) {
    if (this.models[name]) {
        this.debug('Can not override model: ' + name);
        return;
    }

    this.models[name] = model;
};

/**
 * Add an external bundle of media types.
 * @param {Object} map - The media type map of the external library
 */
Formats.prototype.use = function use(bundle) {
    // Build the bundle
    bundle(this);
};
