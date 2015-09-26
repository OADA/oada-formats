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
var _ = require('lodash');
require('extend-error');

var ValidationError = Error.extend('ValidationError');
var InvalidSchemaError = Error.extend('InvalidSchemaError');
var SchemaMismatch = Error.extend('SchemaMismatch');

module.exports = Model;
Model.ValidationError = ValidationError;
Model.InvalidSchemaError = InvalidSchemaError;
Model.SchemaMismatch = SchemaMismatch;

Model.ValidationError.fromErrors = function fromErrors(errors) {
    errors = Array.isArray(errors) ? errors : [errors];

    var message = '';
    _.forEach(errors, function(error) {
        message  = ', ' + error.dataPath + ' ' +
            error.message;
    });
    message = message.replace(/^[, ]+/, '');

    var e = new ValidationError(message);
    e.errors = _.clone(errors);

    return e;
};

/**
 * A format model. Contains _schema, _examples, and validation.
 * @constructor
 * @param {*} schema - A format _schema in what every form validate() needs
 * @param {Array<*>} examples - An array of _examples in native form
 * @param {function} options.addtionalValidators - An array of validating
 *      functions.
 * @param {function} options.debug - A debug logger constructor
 * @param {function} options.error - A custom error logger constructor
 */
function Model(schema, examples, options) {
    options = options || {};

    this._schema = schema || null;
    this._examples = examples || {};
    this._additionalValidators = options.additionalValidators || [];

    this.debugConstructor = options.debug || debug;
    this.debug = this.debugConstructor(this.debugTopic || 'oada:model');
    this.errorConstructor = options.error || debug;
    this.error = this.errorConstructor(this.errorTopic || 'oada:model:error');
}

/**
 * A factory function to build the model from a package.
 * @factory
 */
Model.prototype.fromPackage = Promise.method(function fromPackage() {
    throw new Error('Models should define how to be loaded from a package');
});

/**
 * A function which validates it's input as valid for this format model
 * @param {*} file - The file which is to be validated as the model
 */
Model.prototype.validate = function validate(data) {
    return Promise
        .resolve(data)
        .bind(this)
        .tap(function(data) {
            for (var i = 0; i < this._additionalValidators.length; i++) {
                if (!this._additionalValidators[i](data)) {
                    this.error('Addtional validation failed');
                    throw new ValidationError('Additional validation failed');
                }
            }
        });
};

/**
 * Returns an specific named example
 * @param {string} name - Name of example
 * @returns {*}
 */
Model.prototype.example = Promise.method(function example(name) {
    // Name (string) index
    if (this._examples[name]) {
        return _.clone(this._examples[name]);
    }

    // Try to return the first one
    var keys = Object.keys(this._examples);
    if (!name && keys.length) {
        return _.clone(this._examples[keys[0]]);
    }

    return null;
});

/**
 * Returns all examples
 * @returns {object}
 */
Model.prototype.examples = Promise.method(function examples() {
    return _.clone(this._examples);
});

/**
 * Returns schema
 * @returns {object}
 */
Model.prototype.schema = Promise.method(function schema() {
    return _.clone(this._schema);
});
