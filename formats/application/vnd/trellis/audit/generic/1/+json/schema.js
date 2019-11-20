const libvocab = require('vocabs/trellis');
const {vocab,vocabToProperties} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);


module.exports = oadaSchema({
  _type: 'application/vnd.trellis.audit.primusgfs.1+json',
  description: 
  
'A generic audit document represents the results of an actual auditor from a '+
'certifying_body performing an inspection of a facility or crew.',

  properties: vocabToProperties([
    // A general audit may have some or all of these terms:
    'certificationid', 'scheme', 'certifying_body', 'organization', 'scope', 'conditions_during_audit',
    'scope', 'sections', 'control_points'
  ]),

});
