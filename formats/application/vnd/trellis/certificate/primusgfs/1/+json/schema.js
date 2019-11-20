const libvocab = require('vocabs/trellis');
const {vocab,vocabToProperties,requireValue,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.trellis.audit.primusgfs.1+json',
  description: 
  
'A PrimusGFS audit is like a generic audit, but more restrictive.  Certain keys '+
'are marked as "required" here that should always exist if you have a PrimusGFS '+
'audit.',

  properties: vocabToProperties([
    // certificationid is the same across audit, corrective actions, and certificate
    'certificationid',
    // Total score (preliminary and final) for this audit
    'score',
  ], {
    // scheme: info about the type of audit
    scheme: override('scheme', {
      // PrimusGFS must be a valid 'scheme',
      // also it must have name set to 'PrimusGFS' and have a version
      properties: {
        name: requireValue('PrimusGFS'),
      },
      required: ['name','version'],
    }, { mergePropertiesInsteadOfReplace: true }),
    
    // certifying body: info about who performed the audit
    certifying_body: override('certifying_body', {
      required: ['name', 'auditor'],
    }),
  
    // Organization contains information about the party being audited.
    organization: override('organization', {
      required: [ 'organizationid', 'name' ],
    }),
  
    // Scope: what sorts of things does this audit cover (operation, products, etc.)  
    scope: override('scope', {
      required: [ 'description', 'operation', 'products_observed' ],
    }),
  
    conditions_during_audit: override('conditions_during_audit', {
      properties: {
        FSMS_observed_date: override('FSMS_observed_date', {
          required: [ 'start', 'end' ],
        }),
        operation_observed_date: override('operation_observed_date', {
          required: [ 'start', 'end' ],
        }),
      },
      required: [ 'FSMS_observed_date', 'operation_observed_date' ],
    }),

    certificate_validity_period: override('certificate_validity_period', {
      required: [ 'start', 'end' ],
    }),
 
  }),
});
            
