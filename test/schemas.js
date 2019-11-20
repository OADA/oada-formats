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

process.env.DEBUG=process.env.DEBUG+",oada:formats:error";

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var Formats = require('../formats.js');
const _ = require('lodash');
const config = require('../config');

let types = [];
let formats = null;

describe('Schemas', async () => {

  before(async () => {
    formats = await new Formats();
    types = _.keys(formats.mediatypes);
  });

  it('should compile all schemas under node', () => {

    _.each(types, type => {

      describe(type, () => {
        it('should compile', async () => {
          expect(await formats.model(type)).to.be.an('object');
        });
      });

    });

  });

});

