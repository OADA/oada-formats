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

const Promise = require('bluebird');
Promise.longStackTraces();
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const _ = require('lodash');

const config = require('../config');
let libVocab = null;
let testVocab = null;
// Let's define some testing schemas for re-use below in the tests:
let testSchemas = {
  testlink: {
    description: 'a test term that looks like an oada link',
    properties: { _id: { type: 'string' }, },
  },
  testlink2: {
    description: 'a test term that looks like an oada link',
    properties: { _id: { type: 'string' }, },
  },
  peopleIKnow: {
    description: 'a list of some people I know - for testing',
    properties: {
      bob: { properties: { name: 'Bob Schmob', height: '15' } },
      tina: { properties: { name: 'Tina Schmob' } },
      alfred: { properties: { name: 'Alfred Schmob' } },
    },
  },
  cropsNonStrict: {
    description: 'a test list of some known crop names - non-strict mode',
    type: 'string',
    known: [ 'corn', 'beans', 'wheat', 'rye' ],
  },
  cropsStrict: {
    description: 'a test list of some known crop names - strict mode',
    type: 'string',
    enum: [ 'corn', 'beans', 'wheat', 'rye' ],
  },
  oneWithPatternProperties: { 
    description: 'test with properties and pattern properties',
    properties: { toppropertyshouldstay: { description: 'this one should stay', type: 'string' } },
    patternProperties: { 
      'apattern': { properties: { thisoneshoulddisappear: 'this one should disappear', type: 'string' } },
    },
  },
};


describe('Library - lib/vocab.js', () => {

  // Load the library in the before in case it has parse error:
  before(() => { 
    libVocab = require('../lib/vocab');
    testVocab = libVocab('test');
    // Register a few test vocab terms
    testVocab.register('testlink', testSchemas.testlink);
    testVocab.register('testlink2', testSchemas.testlink2);
    testVocab.register('peopleIKnow', testSchemas.peopleIKnow);
    testVocab.register('cropsNonStrict', testSchemas.cropsNonStrict);
    testVocab.register('cropsStrict', testSchemas.cropsStrict);
    testVocab.register('oneWithPatternProperties', testSchemas.oneWithPatternProperties);
  });

  it('should throw when no modulename is given', () => {
    expect(libVocab).to.throw(libVocab.NoModuleSpecified);
  });

  it('should have a patterns key for index-style property names that does not match oada keywords, indexing, or other indexes', () => {
    const r = new RegExp(testVocab.patterns.indexSafePropertyNames);
    expect(!!'indexing'.match(r)).to.equal(false);
    expect(!!'crop-index'.match(r)).to.equal(false);
    expect(!!'_id'.match(r)).to.equal(false);
    expect(!!'thisoneshouldwork'.match(r)).to.equal(true);
  });

  describe('enumSchema', () => {
    it('should return a schema with a known array of values in non-strict mode', () => {
      config.set('strict', false);
      const s = testVocab.enumSchema(['one', 'two']);
      expect(s).to.deep.equal({
        type: 'string',
        known: [ 'one', 'two' ],
      });
      expect(s).to.not.have.key('enum');
      expect(s).to.not.have.key('properties');
    });

    it('should return a schema with known AND enum in strict mode', () => {
      config.set('strict', true);
      const s = testVocab.enumSchema(['one', 'two']);
      config.set('strict', false);
      expect(s).to.deep.equal({
        type: 'string',
        enum: [ 'one', 'two' ],
        known: [ 'one', 'two' ],
      });
      expect(s).to.not.have.key('properties');
    });
  });

  describe('requireValue', () => {
    it('should return an enum with one item in it', () => {
      expect(testVocab.requireValue('theval')).to.deep.equal({
        type: 'string', enum: [ 'theval' ],
      });
    });
  });

  describe('vocabToProperties', () => {
    it('should return an object with 2 test vocab terms as keys', () => {
      expect(testVocab.vocabToProperties(['testlink', 'peopleIKnow' ]))
      .to.deep.equal({
        testlink: testVocab.vocab('testlink'),
        peopleIKnow: testVocab.vocab('peopleIKnow'),
      });
    });
  });

  describe('vocabToSchema', () => {
    it('should return a schema with properties set to the vocab terms', () => {
      expect(testVocab.vocabToSchema(['testlink', 'peopleIKnow' ]))
      .to.deep.equal({
        properties: {
          testlink: testVocab.vocab('testlink'),
          peopleIKnow: testVocab.vocab('peopleIKnow'),
        },
      });
    });
  });

  describe('arrayToProperties', () => {
    it('should properly zip together an array of 2 key names', () => {
      expect(testVocab.arrayToProperties(['firstone', 'secondone'], { theschema: true }))
      .to.deep.equal({
        firstone: { theschema: true},
        secondone: { theschema: true},
      });
    });
  });

  describe('register', () => {
    it('should not mutate a schema passed to it (it should have it\'s own copy)', () => {
      const schema = { description: 'no change' };
      testVocab.register('donotmutateme', schema);
      expect(schema).to.deep.equal({ description: 'no change' });
    });
    it('should add vocab key to schema with details', () => {
      const s = testVocab.vocab('testlink');
      expect(s.vocab).to.be.an('object');
      expect(s.vocab.module).to.equal('test');
      expect(s.vocab.term).to.equal('testlink');
      expect(s.vocab.registrationOrder).to.be.a('number');
    });
  });

  describe('override', () => {
    it('should properly override a description, retaining vocab under vocab.parent', () => {
      const orig = _.cloneDeep(testVocab.vocab('testlink'));
      const expected = _.cloneDeep(testSchemas.testlink);
      expected.description = 'new description';
      expected.vocab = { parent: orig.vocab };
      expect(testVocab.override('testlink', { description: 'new description' }))
      .to.deep.equal(expected);
    });

    it('should properly replace a known terms array', () => {
      const orig = _.cloneDeep(testVocab.vocab('cropsNonStrict'));
      const expected = _.cloneDeep(testSchemas.cropsNonStrict);
      expected.vocab = { parent: orig.vocab };
      expected.known = [ 'sorghum', 'carrots' ];
      expect(testVocab.override('cropsNonStrict', { known: [ 'sorghum', 'carrots' ] }))
      .to.deep.equal(expected);
    });

    it('should properly replace an enum array', () => {
      const orig = _.cloneDeep(testVocab.vocab('cropsStrict'));
      const expected = _.cloneDeep(testSchemas.cropsStrict);
      expected.vocab = { parent: orig.vocab };
      expected.enum = [ 'sorghum', 'carrots' ];
      expect(testVocab.override('cropsStrict', { enum: [ 'sorghum', 'carrots' ] }))
      .to.deep.equal(expected);
    });

    it('should replace properties if mergePropertiesInsteadOfReplace is NOT set', () => {
      const orig = _.cloneDeep(testVocab.vocab('peopleIKnow'));
      const merge = { properties: {
        alan: { properties: { name: 'Bob Schmob' } },
        steve: { properties: { name: 'Steve' } },
      } };
      const expected = _.cloneDeep(testSchemas.peopleIKnow);
      expected.vocab = { parent: orig.vocab };
      expected.properties = merge.properties;
      expect(testVocab.override('peopleIKnow', merge))
      .to.deep.equal(expected);
    });

    it('should merge properties if mergePropertiesInsteadOfReplace is set', () => {
      const orig = _.cloneDeep(testVocab.vocab('peopleIKnow'));
      const merge = { properties: {
        bob: { properties: { name: 'Bob Has a New Name', age: '10' } },
        steve: { properties: { name: 'Steve' } },
      } };
      const expected = _.cloneDeep(testSchemas.peopleIKnow);
      expected.vocab = { parent: orig.vocab };
      // replace bob's name
      expected.properties.bob.properties.name = merge.properties.bob.properties.name;
      // add age key to bob
      expected.properties.bob.properties.age = merge.properties.bob.properties.age;
      // bob's height key should remain during merge
      // steve property should be added
      expected.properties.steve = merge.properties.steve;
      expect(testVocab.override('peopleIKnow', merge, { mergePropertiesInsteadOfReplace: true }))
      .to.deep.equal(expected);
    });

    it('should replace all properties of items under patternProperties if mergePropertiesInsteadOfReplace is NOT set', () => {
      const orig = _.cloneDeep(testVocab.vocab('oneWithPatternProperties'));
      const merge = {
        patternProperties: {
          'apattern': { properties: { thisoneshouldbecreated: 'this one should appear in final object', type: 'string' } },
        },
      };
      const expected = _.cloneDeep(testSchemas.oneWithPatternProperties);
      expected.vocab = { parent: orig.vocab };
      // replace only the properties on the patternProperties items
      expected.patternProperties.apattern.properties = merge.patternProperties.apattern.properties;
      expect(testVocab.override('oneWithPatternProperties', merge))
      .to.deep.equal(expected);
    });

  });

  describe('vocab', () => {
    it('should return a copy of internal vocab object rather than actual reference', () => {
      const ref = testVocab.vocab('testlink');
      ref.thiskeyshouldnotbehere = 'aha!';
      expect(testVocab.vocab('testlink')).to.not.have.key('thiskeyshouldnotbehere');
    });
    it('should throw when asking for a term that does not exist', () => {
      expect(() => testVocab.vocab('nonexistentterm'))
      .to.throw(testVocab.errors.UnknownVocabularyTerm);
    });
    it('should return true/false when including "exists" option', () => {
      expect(testVocab.vocab('nonexistentterm', { exists: true })).to.equal(false);
      expect(testVocab.vocab('testlink', { exists: true })).to.equal(true);
    });
  });

  describe('link', () => {
    it('should return empty vocab._types if no argument is passed', () => {
      const result = testVocab.link();
      expect(result.vocab._types).to.be.an('array');
      expect(result.vocab._types.length).to.equal(0);
    });

    it('should successfully add a single type to a link', () => {
      const type = 'application/oada.test.1+json';
      const result = testVocab.link(type);
      expect(result.vocab._types).to.deep.equal([type]);
    });

    it('should successfully add multiple _types to a link', () => {
      const types = ['application/oada.test.1+json', 'application/oada.test.2+json']
      const result = testVocab.link(types);
      expect(result.vocab._types).to.deep.equal(types);
    });

    it('should concatenate a type onto existing types for optional base link schema', () => {
      const base = testVocab.vocab('testlink');
      base.vocab._types = [ 'application/oada.test.1+json', 'application/oada.test.2+json' ];
      const types = [ 'application/oada.test.3+json', 'application/oada.test.4+json' ];
      const result = testVocab.link(types, base);
      base.vocab._types = _.concat(base.vocab._types, types);
      expect(result.vocab._types).to.deep.equal(base.vocab._types);
    });

  });

});
