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

describe('Formats', function() {

    var formats;
    beforeEach(function() {
        formats = new Formats();
        formats.use(require('./package'));
    });

    it('Should be a Formats type', function() {
        return expect(formats).to.be.an.instanceof(Formats);
    });

    it('Should fail to make a model of an unknown type', function() {
        return expect(formats.model('test/broken_model_type')).to
            .eventually.be.rejectedWith(Formats.ModelTypeNotFoundError);
    });

    it('Should allow overriding mediatypes', function() {
        formats._addMediatypes({
            'test/1': formats.mediatypes['test/3']
        });

        var schema1 = formats.model('test/1').call('schema');
        var schema2 = formats.model('test/3').call('schema');

        return schema2
            .then(function(s2) {
                expect(schema1).to.eventually.deep.equal(s2);
            });
    });

    it('Should not allow overriding models', function() {
        var model = formats.models['json'];
        var r = formats._addModel('json', function() {});
        var model2 = formats.models['json'];

        expect(r).to.not.be.ok;
        expect(model2).to.equal(model);
    });
});
