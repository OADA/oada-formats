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
const _ = require('lodash');
const config = require('../config');

describe('Examples', async () => {

  before(async () => {
    const formats = new Formats();
    const mediatypes = _.keys(formats.mediatypes);
    await Promise.map(mediatypes, async (type) => {

      // The "strict" config is accessed when the model is loaded, so 
      // we need to load 2 copies of the model: strict form and non-strict form
      const m = await formats.model(type);
      config.set('strict', true);
      const mstrict = await formats.model(type);
      config.set('strict', false);
      const examples = await m.examples();
      describe(type, async () => {
        it('should have default example', async () => {
          expect(typeof m.example('default')).to.equal('object');
        });
        _.each(examples, (example,name) => {
          it('example '+name+' should validate against regular schema', async () => {
            const isvalid = await m.validate(example);
            expect(isvalid).to.equal(true);
          });
          it('example '+name+' should validate against strict schema', async () => {
            const isvalid = await mstrict.validate(example);
            expect(isvalid).to.equal(true);
          });
        });
      });
    });
  });

  // Hack to get the tests to run when created in promises:
  it('Should run the tests before this', () => {});

/*
    describe('Validate all examples against schemas', function() {

      return Promise.map(mediatypes, function(type) {
        describe('    checking mediatype: '+type, function() {
          let model = await 
          return formats.model(mediatype)
          .then(function(m) {
              return m.examples()
            .then(function(examples) {
              models[type] = {
                model: m,
                examples: examples,
              };
            });
          });
        // Then load all the models for strict mode:
        }).then(function() {
        });
      });

      _.each(mediatypes, function(type) {
        it('all examples for '+mediatype+' should validate against schema in non-strict mode', function() {
          return Promise.map(models[type].examples, function(example) {
            return models[type].model.validate(example)
            .then(function(isvalid) {
              if (!isvalid) console.log('ERROR on example '+examplename+' for mediaType '+mediaType);
              expect(isvalid).to.equal(true);
            });
          });
        });
      });
    });

    describe('application/vnd.oada.oada-configration.1+json', function() {

        it('should support RS256', function() {
            var key = 'token_endpoint_auth_signing_alg_values_supported';

            return formats
                .model('application/vnd.oada.oada-configuration.1+json')
                .then(function(model) {
                    return model
                        .example('default')
                        .then(function(example) {
                            example[key] = [];

                            return expect(model.validate(example))
                                .to.eventually.be
                                .rejectedWith(Formats.Model.ValidationError,
                                '.' + key + ' should have "RS256" as an ' +
                                'element');
                        });
                });
        });

    });
*/
});

