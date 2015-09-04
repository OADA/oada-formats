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

var path = require('path');
var debug = require('debug');
var Promise = require('bluebird');
var glob = require('glob');

var Model = require('./model');

module.exports = Formats;

/**
 * Maintains and builds OADA format models
 * @constructor
 * @param {object} options - Various optional options
 * @param {object} options.mediaTypeMap - A default custom media type map
 * @param {function} options.debug - A custom debug logger, debug.js interface
 * @param {function} options.error - A custom error logger, debug.js interface
 */
function Formats(options) {
    options = options || {};

    this._debug = options.debug || debug('oada:formats');
    this._error = options.error || debug('oada:formats:error');

    // Scan the models directory for all of the avaiable mediatypes
    var subModules = glob
        .sync('index.js', {
            cwd: path.join(__dirname, 'models'),
            matchBase: true}
        )
        .map(function(path) {
            return path.replace("/index.js", "");
        });

    var mediaTypes = subModules
        .map(function(path) {
            return path
                .replace(/\//g, '.')
                .replace('.', '/')
                .replace(/\.\+([^+]*$)/, "+$1");
        });

    this._mtMap = {};
    for(var i = 0; i < subModules.length; i++) {
        this._mtMap[mediaTypes[i]] = '.' + path.sep +
            path.join('models', subModules[i]);
    }
}

/**
 * Factory function for a media type model.
 * Tries to lookup and load the media type's sub-moudle and adds it to the Model
 * class before returning it. It is assumed the sub-model return sa promise or
 * an object of promises.
 * @param {string} mediaType - The media type of model being requested
 * @param {object} [options] - Options for a custom model
 * @returns {Model}
 */
Formats.prototype.model = function model(mediaType, options) {
    return Promise
        .try(function() {
            this._debug('Loading model data: ' + this._mtMap[mediaType] +
                    ' for mediaType: ' + mediaType);
            return require(this._mtMap[mediaType]);
        }.bind(this))
        .bind(this)
        .props()
        .then(function(data) {
            var model = new Model({
                debug: this._debug,
                error: this._error,
                example: data.example,
                schema: data.schema
            });

            if(data.mixin) {
                this._debug('Loading model minxins');
                data.mixin.call(model, options);
            }

            return model;
        })
        .error(function() {
            this._error('Could not find model for media type: ' + mediaType);
            throw new Error(mediaType + ' not found');
        });
};

/**
 * Add an external library of media types
 * @param {Object} map - The media type map of the external library
 */
Formats.prototype.use = function use(map) {
    Object.keys(map).forEach(function(mediaType) {
        if(typeof map[mediaType] === 'string') {
            this._mtMap[mediaType] = map[mediaType];
        }
    }, this);
};
