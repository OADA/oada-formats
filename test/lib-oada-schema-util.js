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

  // before-all hook will process this next one to get an object in there:
  schemaMixIndexing: {
    _type: 'application/vnd.oada.test.2+json',
    indexing: [ 'to-be-replaced-in-before-hook', 'crop-index', 'geohash-index' ],
    properties: {
      key1: { type: 'string' },
    },
  },
};

describe('Library - lib/oada-schema-util.js', () => {

  // Load the library in the 'before' in case it has parse error:
  before(() => { 
    oadaVocab = require('../vocabs/oada');
    libSchema = require('../lib/oada-schema-util')(oadaVocab);

    // replace 'year-index' with vocab('year-index'):
    testSchemas.schemaMixIndexing.indexing[0] = oadaVocab.vocab('year-index');
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

    it('should have property named indexing as an array describing index properties', () => {
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      expect(schema.properties.indexing.type).to.equal('array');
      // each of the items in the array should represent one of the indexing terms
      const expectedMembers = _.map(testSchemas.regularSchemaBeforeOADASchema.indexing, i => oadaVocab.vocab(i).indexingSchema);
      expect(schema.properties.indexing.items.anyOf).to.have.deep.members(expectedMembers);
    });

    it('should include each possible index term as a key in properties', () => {
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      _.each(testSchemas.regularSchemaBeforeOADASchema.indexing, 
        i => expect(schema.properties[i]).to.include.keys(_.keys(oadaVocab.vocab(i)))
      );
    });

    it('should include the schema\'s _type in the vocab._type for all links in index schema', () => {
      // test for both enum-style index (crop-type), and pattern-style index (year)
      const schema = libSchema.oadaSchema(testSchemas.regularSchemaBeforeOADASchema);
      // we know regularSchemaBeforeOADASchema contains crop-index and year-index
      const cropIndex = oadaVocab.vocab('crop-index');
      const yearIndex = oadaVocab.vocab('year-index');
      const _type = testSchemas.regularSchemaBeforeOADASchema._type;
      // Check the properties and the patternProperties:
      _.each(cropIndex.properties, 
        (link,key) => {
          expect(schema.properties['crop-index'].properties[key].vocab._type).to.include(_type)
        }
      );
      _.each(yearIndex.patternProperties, 
        (link,key) => expect(schema.properties['year-index'].patternProperties[key].vocab._type).to.include(_type)
      );
    });

    it('should allow a mix of vocab terms and manual schemas in indexing', () => {
      const schema = libSchema.oadaSchema(testSchemas.schemaMixIndexing);
      expect(schema.properties).to.include.key('year-index');
    });

    it('should throw when given term schema without indexingSchema', () => {
      const schema = _.cloneDeep(testSchemas.schemaMixIndexing);
      delete schema.indexing[0].indexingSchema;
      let error = false;
      try { libSchema.oadaSchema(schema) } catch(e) { error = e; }
      expect(error).to.be.an.instanceof(libSchema.errors.NoIndexingSchemaKeyDefinedOnIndexError);
    });

    // should throw when non-vocab schema indexingSchema has no index key for property name
    it('should throw when given non-vocab schema that has no enum index key to get the name', () => {
      const schema = _.cloneDeep(testSchemas.schemaMixIndexing);
      delete schema.indexing[0].indexingSchema.properties.index;
      let error = false;
      try { libSchema.oadaSchema(schema) } catch(e) { error = e; }
      expect(error).to.be.an.instanceof(libSchema.errors.IndexingNonVocabSchemaLacksIndexKeyForItsName);
    });
  });
});

