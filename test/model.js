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
chai.use(require('chai-spies'));
var expect = chai.expect;
var Model = require('../model.js');

describe('model', function() {

    var model;
    before(function() {
        model = new Model();
    });

    it('Should be a Model type', function() {
        return expect(model).to.be.an.instanceof(Model);
    });

    it('Should require fromPackage to be overridden', function() {
        return expect(model.fromPackage()).to.eventually.be.rejectedWith(Error);
    });

    it('Should call all addtionalValidators', function() {
        var av1 = chai.spy(function() {
            return true;
        });
        var av2 = chai.spy(function() {
            return true;
        });
        model = new Model(undefined, undefined, {
            additionalValidators: [av1, av2]
        });

        var valid = model
            .validate({})
            .then(function() {
                expect(av1).to.be.called.once;
                expect(av2).to.be.called.once;

                return true;
            });

        return expect(valid).to.eventually.be.ok;
    });

    it('Should stop calling addtionalValidators after failure', function() {
        var av1 = chai.spy(function() {
            return true;
        });
        var av2 = chai.spy(function() {
            return false;
        });
        var av3 = chai.spy(function() {
            return true;
        });
        model = new Model(undefined, undefined, {
            additionalValidators: [av1, av2, av3]
        });

        var valid = model
            .validate({})
            .catch(function() {
                expect(av1).to.be.called.once;
                expect(av2).to.be.called.once;
                expect(av3).to.not.be.called;

                return true;
            });

        return expect(valid).to.eventually.be.ok;
    });

    it('Should reject for fasly addtionalValidators', function() {
        model = new Model(undefined, undefined, {
            additionalValidators: [
                function() {
                    return false;
                }
            ]
        });

        return expect(model.validate({})).to
            .eventually.be.rejectedWith(Model.ValidationError);
    });

    it('Should default examples to null', function() {
        return expect(model.example()).to.eventually.equal(null);
    });

});
