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
const Ajv = require('ajv');
const ajv = new Ajv();

const config = require('../config');
let oadaVocab = null;
let libSchema = null;

const testSchemas = {
  deepTree: {
    properties: {
      top1: {
        properties: {
          middle11: {
            properties: {
              bottom111: { type: 'string' },
              bottom112: { type: 'string' },
            },
          },
          middle12: {
            properties: {
              bottom121: { type: 'string' },
              bottom122: { type: 'string' },
            },
          },
        },
      },
      top2: {
        properties: {
          middle21: {
            properties: {
              bottom211: { type: 'string' },
              bottom212: { type: 'string' },
            },
          },
          middle22: {
            properties: {
              bottom221: { type: 'string' },
              bottom222: { type: 'string' },
            },
          },
        },
      },
    },
  },
  patternPropertiesTest: {
    patternProperties: {
      'exp1': { },
      'exp2': { type: 'string' },
    },
  },
  regularSchemaBeforeOADASchema: {
    _type: 'application/vnd.oada.test.1+json',
    indexing: [ 'year-index', 'crop-index', 'geohash-index' ],
    properties: {
      key1: { type: 'string' },
    },
  },
};

describe('Library - lib/oada-schema-util.js', () => {

  // Load the library in the before in case it has parse error:
  before(() => { 
    oadaVocab = require('../vocabs/oada');
    libSchema = require('../lib/oada-schema-util')(oadaVocab);
  });

  describe('versionedLink', () => {
    it('should add a _type for a _type-less starting link for both functions', () => {
      const expected = oadaVocab.vocab('versioned-link');
      expected.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.1' ]);
      expected.vocab = { parent: expected.vocab };
      expect(libSchema.versionedLink([ 'application/vnd.oada.test.1' ]))
      .to.deep.equal(expected);
    });

    it('should replace existing _type\'s on a link for both functions', () => {
      const orig = oadaVocab.vocab('versioned-link');
      orig.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.2', 'applicaiton/vnd.oada.test.3' ]);
      const expected = _.cloneDeep(orig);
      expected.vocab = { parent: expected.vocab };
      expected.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.1' ]);
      expect(libSchema.versionedLink([ 'application/vnd.oada.test.1' ]))
      .to.deep.equal(expected);
    });
  });

  describe('link', () => {
    it('should add a _type for a _type-less starting link', () => {
      const expected = oadaVocab.vocab('link');
      expected.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.1' ]);
      expected.vocab = { parent: expected.vocab };
      expect(libSchema.link([ 'application/vnd.oada.test.1' ]))
      .to.deep.equal(expected);
    });

    it('should replace existing _type\'s on a link', () => {
      const orig = oadaVocab.vocab('link');
      orig.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.2', 'applicaiton/vnd.oada.test.3' ]);
      const expected = _.cloneDeep(orig);
      expected.vocab = { parent: expected.vocab };
      expected.properties._type = oadaVocab.enumSchema([ 'application/vnd.oada.test.1' ]);
      expect(libSchema.link([ 'application/vnd.oada.test.1' ]))
      .to.deep.equal(expected);
    });
  });


  describe('recursivelyChangeAllAdditionalProperties', () => {
    it('should set all additionalProperties on a deep tree', () => {
      // Note, it does not set additionalProperties on the "string" types on the leaves
      const orig = _.cloneDeep(testSchemas.deepTree);
      const expected = _.cloneDeep(orig);
      expected.additionalProperties = true;
      expected.properties.top1.additionalProperties = true;
      expected.properties.top1.properties.middle11.additionalProperties = true;
      expected.properties.top1.properties.middle12.additionalProperties = true;
      expected.properties.top2.additionalProperties = true;
      expected.properties.top2.properties.middle21.additionalProperties = true;
      expected.properties.top2.properties.middle22.additionalProperties = true;
      libSchema.recursivelyChangeAllAdditionalProperties(orig, true);
      expect(orig).to.deep.equal(expected);
    });

    it('should set all additionalProperties on patternProperties', () => {
      const orig = _.cloneDeep(testSchemas.patternPropertiesTest);
      const expected = _.cloneDeep(orig);
      expected.additionalProperties = true;
      expected.patternProperties.exp1.additionalProperties = true;
      // exp2 won't get additionalProperties because it is type string
      libSchema.recursivelyChangeAllAdditionalProperties(orig, true);
      expect(orig).to.deep.equal(expected);
    });
  });

  describe('oadaSchema', () => {
    it('should throw if you forgot _type, properties, or passed a null schema', () => {
      // passed nothing:
      expect(() => libSchema.oadaSchema(
        null
      )).to.throw(libSchema.errors.InvalidOadaSchemaError);
      // forgot properties:
      expect(() => libSchema.oadaSchema({
        _type: 'testone',
      })).to.throw(libSchema.errors.InvalidOadaSchemaError);
      // Forgot _type:
      expect(() => libSchema.oadaSchema({
        properties: {}
      })).to.throw(libSchema.errors.InvalidOadaSchemaError);
    });

    it('should set an id', () => {
      const result = libSchema.oadaSchema({ _type: 'testone', properties: {} });
      expect(result.id).to.be.a('string');
    });

    it('should add the _type from top-level to properties and require it', () => {
      const result = libSchema.oadaSchema({ _type: 'testone', properties: {} });
      expect(result.properties._type).to.deep.equal({ type: 'string', enum: ['testone']});
      expect(result.required).to.contain('_type');
    });

    it('should produce a schema that fails to validate a document with incorrect _type', () => {
      const schema = libSchema.oadaSchema({ _type: 'testone', properties: {} });
      expect(ajv.validate(schema, { no: 'type on this one' })).to.equal(false);
      expect(ajv.validate(schema, { _type: 'this is the wrong type' })).to.equal(false);
    });

    it('should produce a schema that validates a document with a _type', () => {
      const schema = libSchema.oadaSchema({ _type: 'testone', properties: {} });
      expect(ajv.validate(schema, { _type: 'testone' })).to.equal(true);
    });
     
    it('should retain the top-level indexing array', () => {
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      expect(schema.indexing).to.deep.equal(testSchemas.regularSchemaBeforeOADASchema.indexing);
    });

    it('should include each possible index as a key in properties', () => {
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      _.each(testSchemas.regularSchemaBeforeOADASchema.indexing, i => expect(schema.properties[i]).to.be.an('object') );
    });

    it('should have property named indexing as an array describing index properties', () => {
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      expect(schema.properties.indexing.type).to.equal('array');
      // each of the items in the array should represent one of the indexing terms
      const expectedMembers = _.map(testSchemas.regularSchemaBeforeOADASchema.indexing, i => ({ [i]: vocab(i) }));
      expect(schema.properties.indexing.items.anyOf).to.have.deep.members(expectedMembers);
    });

    it('should have each pattern

  });
});
