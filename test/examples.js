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

let formats = null;
let types = null;
let itemsToTest = [];

describe('Examples', async () => {

  before(async () => {
    formats = new Formats();
    types = _.keys(formats.mediatypes);

    await Promise.map(types, async (type) => {

      // The "strict" config is accessed when the model is loaded, so 
      // we need to load 2 copies of the model: strict form and non-strict form
      const m = await formats.model(type);
      config.set('strict', true);
      const mstrict = await formats.model(type);
      config.set('strict', false);
      const examples = await m.examples();

      itemsToTest.push({ type, m, mstrict, examples });
    });
  });

  it('should all compile and pass schemas under node', () => {
    _.each(itemsToTest, t => {
      describe(t.type, () => {
        it('should have default example', async () => {
          expect(typeof t.m.example('default')).to.equal('object');
        });
  
        _.each(t.examples, (example,name) => {
          it('example '+name+' should validate against regular schema', async () => {
            const isvalid = await t.m.validate(example);
            expect(isvalid).to.equal(true);
          });
          it('example '+name+' should validate against strict schema', async () => {
            const isvalid = await t.mstrict.validate(example);
            expect(isvalid).to.equal(true);
          });
        });
      });
    });
  });

});

