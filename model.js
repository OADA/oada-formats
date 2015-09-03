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

var Promise = require('bluebird');
var debug = require('debug');

require('extend-error');
var NoSchemaError = Error.extend('NoSchemaError');

module.exports = Model;

function Model(options) {
    options = options || {};

    this.example = options.example;
    this.schema = options.schema;

    this._debug = options.debug || debug('oada:model');
    this._error = options.error || debug('oada:model:error');
}

// TODO: Should it return true/false or throw on invalid?
Model.prototype.validate = Promise.method(function validate(data) {
    if(!this.schema) {
        var message = 'No schmea to validate model';
        this._error(message);
        throw new NoSchemaError(message);
    }

    // TODO: Wire in ajv.
    console.log(data[0]);
    return false;
});
