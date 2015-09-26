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
var Formats = require('..');
var Model = require('../model.js');

describe('JsonModel', function() {

    var formats;
    beforeEach(function() {
        formats = new Formats();
        formats.use(require('./package'));
    });

    it('Should reject with unknown mediatype', function() {
        var m = formats.model('This_should_never_exist');

        return expect(m).to.eventually.be
            .rejectedWith(Formats.MediaTypeNotFoundError);
    });

    it('Should return model for known mediatype (with validator)', function() {
        var m = formats.model('test/1');

        return Promise.all([
            m.then(function(model) {
                expect(model._schema).to.be.ok;
                expect(model._examples).to.be.an('object');
            }),
            expect(m).to.eventually.be.instanceof(Model),
        ]);
    });

    it('Should return model for known mediatype (with suffix)', function() {
        var m = formats.model('test/2+json');

        return Promise.all([
            m.then(function(model) {
                expect(model._schema).to.be.ok;
                expect(model._examples).to.be.an('object');
            }),
            expect(m).to.eventually.be.instanceof(Model),
        ]);
    });

    it('Should return default example', function() {
        return formats
            .model('test/1')
            .then(function(model) {
                var keys = Object.keys(model._examples);

                expect(model.example()).to
                    .eventually.deep.equal(model._examples[keys[0]]);
                expect(model.example(keys[0])).to
                    .eventually.deep.equal(model._examples[keys[0]]);
                expect(model.example('should_not_exist')).to
                    .eventually.be.null;
            });
    });

    it('Should return all the examples', function() {
        return formats
            .model('test/1')
            .then(function(model) {
                expect(model.examples()).to
                    .eventually.deep.equal(model._examples);
                expect(Object.keys(model._examples).length).to.be.gt(0);
            });
    });

    it('Should return the schema', function() {
        return formats
            .model('test/1')
            .then(function(model) {
                expect(model.schema()).to.eventually.be.ok;
                expect(model.schema()).to.eventually.deep.equal(model._schema);
            });
    });

    it('Should validate for valid data', function() {
        return formats
            .model('test/1')
            .then(function(model) {
                return [model, model.example()];
            })
            .spread(function(model, example) {
                return expect(model.validate(example))
                    .to.eventually.equal(true);
            });
    });

    it('Should fail to validate for invalid data', function() {
        return formats
            .model('test/1')
            .then(function(model) {
                return expect(model.validate({a: 'b'}))
                    .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.a should match pattern "^a.+$"');
            });
    });

    it('Should validate with $ref for valid data', function() {
        return formats
            .model('test/2+json')
            .then(function(model) {
                return [model, model.example()];
            })
            .spread(function(model, example) {
                return expect(model.validate(example))
                    .to.eventually.equal(true);
            });
    });

    it('Should fail to validate with $ref for invalid data', function() {
        return formats
            .model('test/2+json')
            .then(function(model) {
                return Promise.all([
                    expect(model.validate({}))
                        .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.b should have required property .b'),
                    expect(model.validate({b:{a:'c'}}))
                        .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.b.a should match pattern "^a.+$"')

                ]);
            });
    });

    it('Should validate with nested $ref for valid data', function() {
        return formats
            .model('test/3')
            .then(function(model) {
                return [model, model.example()];
            })
            .spread(function(model, example) {
                return expect(model.validate(example))
                    .to.eventually.equal(true);
            });
    });

    it('Should fail to validate with nested $ref for invalid data', function() {
        return formats
            .model('test/3')
            .then(function(model) {
                return Promise.all([
                    expect(model.validate({}))
                        .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.c should have required property .c'),
                    expect(model.validate({b:{a: 'c'}}))
                        .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.c should have required property .c'),
                    expect(model.validate({c:{b:{a: 'c'}}}))
                        .to.eventually.be.rejectedWith(Model.ValidationError,
                            '.c.b.a should match pattern "^a.+$"')
                ]);
            });
    });

    it('Should fail to validate with missing $ref', function() {
        return formats
            .model('test/broken_ref')
            .then(function(model) {
                return expect(model.validate({})).to.eventually.be
                    .rejectedWith(Formats.MediaTypeNotFoundError);
            });
    });

    it('Should fail to validate with no schema', function() {
        return formats
            .model('test/broken_no_schema')
            .then(function(model) {
                return expect(model.validate({})).to.eventually.be
                    .rejectedWith(Formats.InvalidSchemaError);
            });

    });

    it('Should validate mediatypes with only one part', function() {
        return formats
            .model('top_level')
            .then(function(model) {
                return [model, model.example()];
            })
            .spread(function(model, example) {
                return expect(model.validate(example))
                    .to.eventually.equal(true);
            });
    });

    it('Should validate metdiaTypes with $refs with only one part', function() {
        return formats
            .model('top_level_ref')
            .then(function(model) {
                return [model, model.example()];
            })
            .spread(function(model, example) {
                return expect(model.validate(example))
                    .to.eventually.equal(true);
            });

    });
});
