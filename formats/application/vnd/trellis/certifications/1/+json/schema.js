const      vocab = require('../../../../../../../vocabs/trellis');
const schemaUtil = require('../../../../../../../lib/schema-util');
schemaUtil.setVocab(vocab);

const randomStrKeyRegexp = vocab.randomStrKeyRegexp;
console.log('randomStrKeyRegexp = ', randomStrKeyRegexp);
const versionedLink = schemaUtil.versionedLink;

module.exports = schemaUtil.oadaSchema({
  description: 'This is document with a list of links to certifications.  The keys are '
              +'random strings.  It is also possible to have a dynamic index that '
              +'represents a set of smaller groups of certifications.  In that case, '
              +'an id-index key or other grouping would be found here.',

  // known indexing schemes you may find here.  NOTE: these are not the ONLY allowable
  // indexing schemes, just the known ones as of now.  Strict mode will fail if unknown
  // ones are present in the document.  Note also that these indexing terms must
  // be defined in the vocabulary.
  indexing: [ 'id-index' ],

  properties: {
    _type: 'application/vnd.trellis.certifications.1+json',
    // If there is an index, the value of the indexes would go into
    // context.  oadaSchema handles putting the known indexing schemes
    // into the context schema for you, but none of them are required.
    context: vocab('context'),
  },
  // These are the links to the actual certifications.  The keys are random,
  // with the exception that they can't be 'context', '*-index', or conflict
  // with OADA top-level keys, hence the randomStrKeyRegexp.
  patternProperties: {
    [randomStrKeyRegexp]: versionedLink([ 'application/vnd.trellis.certification.1+json' ]),
  },
});
