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

var url = require('url');
var util = require('util');
var Promise = require('bluebird');
var path = require('path');
var glob = require('glob');
var Ajv = require('ajv');

module.exports = function(context) {
    context._addModel('json', JsonModel);

    function JsonModel(schema, examples, options) {
        context.Model.apply(this, arguments);

        this.debug = options.debug('oada:formats:JsonModel');
        this.error = options.error('oada:formats:JsonModel:error');
    }
    util.inherits(JsonModel, context.Model);

    // Share one ajv class across all JsonModels
    JsonModel.prototype._ajv = new Ajv({
        loadSchema: function(uri, cb) {
            var parts = url.parse(uri);
            var mediatype = parts.host + (parts.path || '');

            return context
                .model(mediatype)
                .call('schema')
                .nodeify(cb);
        }
    });
    JsonModel.prototype._ajv.compileAsyncP =
        Promise.promisify(JsonModel.prototype._ajv.compileAsync);

    JsonModel.prototype.validate = function validate() {
        return context.Model.prototype.validate
            .apply(this, arguments)
            .bind(this)
            .then(function(data) {
                if (!this._schema) {
                    var message = 'No schmea to validate json data against';
                    this.error(message);
                    throw new context.Model.InvalidSchemaError(message);
                }

                return this._ajv
                    .compileAsyncP(this._schema)
                    .bind(this)
                    .then(function(validate) {
                        if (!validate(data)) {
                            this.error(validate.errors);
                            throw context.Model
                                .ValidationError.fromErrors(validate.errors);
                        } else {
                            return true;
                        }
                    });
            });
    };

    JsonModel.fromPackage = function fromPackage(pack, options) {
        return Promise.try(function() {
            var paths = glob.sync(path.join(pack._path, 'schema.@(js|json)'));

            var schema;
            if (paths[0]) {
                schema = require(paths[0]);
            }

            var examples = {};
            glob
                .sync(path.join(pack._path, 'examples/*.@(js|json)'))
                .forEach(function(p) {
                    var parts = path.parse(p);

                    examples[parts.name] = require(p);
                });

            if (pack.additionalValidators) {
                options.additionalValidators = pack.additionalValidators;
            }

            return new JsonModel(schema, examples, options);
        });
    };
};
