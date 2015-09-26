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
Promise.longStackTraces();
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var Formats = require('../formats.js');

var formats = new Formats();

describe('Verify built in mediatypes', function() {

    Object.keys(formats.mediatypes).forEach(function(mediatype) {

        it('Verify ' + mediatype + ' schema and example', function() {
            return formats
                .model(mediatype)
                .then(function(model) {
                    return expect(model.validate(model.example('default')))
                        .to.eventually.equal(true);
                });
        });
    });

    describe('application/vnd.oada.oada-configration.1+json', function() {

        it('should support RS256', function() {
            return formats
                .model('application/vnd.oada.oada-configuration.1+json')
                .then(function(model) {
                    return model
                        .example('default')
                        .then(function(ex) {
                            ex['client_assertion_signing_alg_values_supported']
                                = [];

                            return expect(model.validate(ex))
                                .to.eventually.be
                                .rejectedWith(Formats.Model.ValidationError,
                                '.client_assertion_signing_alg_values_' +
                                'supported should have "RS256" as an element');
                        });
                });
        });

    });
});
