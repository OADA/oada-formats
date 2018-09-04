var schemaUtil = require('../../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../../vocabs/trellis');

var restrictItemsTo = schemaUtil.restrictItemsTo;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({
  description: 
  
'A PrimusGFS audit is like a generic audit, but more restrictive.  Certain keys '+
'are marked as "required" here that should always exist if you have a PrimusGFS '+
'audit.',

  properties: {
    // oadaSchema requires this _type on the schema it produces
    _type: 'application/vnd.trellis.audit.primusgfs.1+json',

    // certificationid is the same across audit, corrective actions, and certificate
    certificationid: vocab('certificationid'),
  
    // scheme: info about the type of audit
    scheme: vocab('scheme', {
      // PrimusGFS must be a valid 'scheme',
      // also it must have name set to 'PrimusGFS' and have a version
      also: {
        required: ['name','version'],
        properties: {
          name: requireValue('PrimusGFS'),
        },
      }
    }),
    
    // certifying body: info about who performed the audit
    certifying_body: vocab('certifying_body', {
      also: {
        required: ['name', 'auditor'],
      }
    }),
  
    // Organization contains information about the party being audited.
    organization: vocab('organization', {
      also: {
        required: [ 'organizationid', 'name' ],
      }
    }),
  
    // Scope: what sorts of things does this audit cover (operation, products, etc.)  
    scope: vocab('scope', {
      also: {
        required: [ 'description', 'operation', 'products_observed' ],
      },
    }),
  
    conditions_during_audit: vocab('conditions_during_audit', {
      also: {
        required: [ 'FSMS_observed_date', 'operation_observed_date' ],
        properties: {
          'FSMS_observed_date': vocab('FSMS_observed_date', {
            required: [ 'start', 'end' ],
          }),
          'operation_observed_date': vocab('operation_observed_date', {
            required: [ 'start', 'end' ],
          }),
        },
      },
    }),

    certificate_validity_period: vocab('certificate_validity_period', {
      also: {
        required: [ 'start', 'end' ],
      }
    }),
  
    // Total score (preliminary and final) for this audit
    score: vocab('score'), 
  
  },
});
            
