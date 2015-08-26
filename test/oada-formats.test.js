/* Copyright 2015 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var _ = require('lodash');

// Library under test:
var oada_formats = require('../model.js');

describe('oada-formats', function() {
  describe('.knownMediaTypes()', function() {
    var all_types;
    before(function() {
      return oada_formats.knownMediaTypes()
      .then(function(_all_types) {
        all_types = _all_types;
      });
    });
   
    it('should have some known types', function() {
      expect(all_types).to.be.an('array');
      expect(all_types).to.not.be.empty;
    });
  });

  ///////////////////////////////////////////////////////////////////////////
  // Make sure every format has validate() and example() functions, and
  // that the example successfully passes validation
  oada_formats.knownMediaTypes()
  .then(function(all_types) {
    describe('Each type: ', function() {
      _.each(all_types, function(one_type) {

        // For each of the media types returned, create a describe block:
        describe(one_type+': ', function() {
    
          it('should return the module given the media type', function() {
            return oada_formats
            .byMediaType(one_type)
            .then(function(model) {
              expect(model.example).to.be.a('function');
              expect(model.validate).to.be.a('function');
            });
          });
    
          it('should return an example() that passes validate()', function() {
            return oada_formats
            .byMediaType(one_type)
            .then(function(model) {
              expect(model.validate(model.example())).to.equal(true);
            });
          });
        });
      });
    });
  });

});
