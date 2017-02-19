var schemaUtil = require('../../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../../vocabs/fpad');

var restrictItemsTo = schemaUtil.restrictItemsTo;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var requireValue = schemaUtil.requireValue;


module.exports = schemaUtil.oadaSchema(vocabTermsToSchema([ 
  // A general audit may have some or all of these terms:
  'certificationid', 'scheme', 'certifying_body', 'organization', 'scope', 'conditions_during_audit',
  'scope', 'sections', 'control_points'
], {
  description: 
  
'A generic audit document represents the results of an actual auditor from a '+
'certifying_body performing an inspection of a facility or crew.',

  properties: {
    // oadaSchema requires this _type on the schema it produces
    _type: 'application/vnd.fpad.audit.primusgfs.1+json',
  },

}, { 
  vocabfunc: vocab 
}));
