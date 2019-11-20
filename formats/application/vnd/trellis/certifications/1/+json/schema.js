const libvocab = require('vocabs/trellis');
const {vocab,vocabToProperties,versionedLink,patterns} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.trellis.certifications.1+json',
  description: 'This is document with a list of links to certifications.  The keys are '
              +'random strings.  It is also possible to have a dynamic index that '
              +'represents a set of smaller groups of certifications.  In that case, '
              +'an id-index key or other grouping would be found here.',

  // These are the links to the actual certifications.  The keys are random,
  // with the exception that they can't be 'context', '*-index', or conflict
  // with OADA top-level keys, hence the randomStrKeyRegexp.
  patternProperties: {
    [patterns.indexSafePropertyNames]: versionedLink([ 'application/vnd.trellis.certification.1+json' ]),
  },
});
