const libvocab = require('vocabs/trellis');
const {vocab,vocabToProperties,override,requireValue} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({
  _type: 'application/vnd.trellis.audit.globalgap.1+json',
  description: 
  
'A GlobalGAP audit is like a generic audit, but more restrictive.  Certain keys '+
'are marked as "required" here that should always exist if you have a GlobalGAP '+
'audit.',

  properties: vocabToProperties([

    // certificationid is the same across audit, corrective actions, and certificate
    'certificationid',
     // Total score (preliminary and final) for this audit
    'score',
    // This part describes the overall structure of the document.  Odds are good that all PrimusGFS harvest crew reports
    // have the same sections and control points.  Note that a section may contain other sections, or it may contain control pointids.
    'sections',
    // All the control points, regardless of section, go in this part.  Key is the 
    // control_pointid for that question
    'control_points',
  ], {  
    // scheme: info about the type of audit
    scheme: override('scheme', {
      // GlobalGAP must be a valid 'scheme',
      // also it must have name set to 'GLOBALGAP' and have a version
      properties: {
        name: requireValue('GLOBALGAP'),
      },
      required: ['name','version','option','modules'],
    }, { mergePropertiesInsteadOfReplace: true }),
    
    // certifying body: info about who performed the audit
    certifying_body: override('certifying_body', {
      required: ['name', 'auditor'],
    }),
  
    // Organization contains information about the party being audited.
    organization: override('organization', {
      required: [ 'organizationid', 'name', 'otherids' ], // otherids should have certifying_body ID in it.
    }),
  
    // Scope: what sorts of things does this audit cover (operation, products, etc.)  
    scope: override('scope', {
      required: [ 'notification', 'description', 'operations', 'products_observed' ],
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
  }), 
});
            
