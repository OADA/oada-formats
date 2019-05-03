var schemaUtil = require('../../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../../vocabs/trellis');

var restrictItemsTo = schemaUtil.restrictItemsTo;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({
  description: 
  
'This is the scehma for a CanadaGAP audit.  Please refer to the example and '+
'the accompanying spreadsheet for how this translates into an actual audit'.

  properties: {
    // oadaSchema requires this _type on the schema it produces
    _type: 'application/vnd.trellis.audit.canadagap.1+json',

    // certificationid is the same across audit, corrective actions, and certificate
    // CanadaGAP does not define a scheme-wide identification scheme, so this
    // will be assigned by the certification body
    certificationid: vocab('certificationid'),
  
    // scheme: info about the type of audit
    scheme: vocab('scheme', {
      also: {
        required: ['name','version', 'options'],
        properties: {
          name: requireValue('CanadaGAP'),
        },
      }
    }),

    // certifying body: info about who performed the audit
    certifying_body: vocab('certifying_body', {
      also: {
        required: ['name', 'auditor'],
        // The line below means that of all the keys possible under
        // certifying_body, canadagap is known to have name, auditor, 
        // and reviewer keys.  The line above (require:) means that
        // of those, the auditor and the name are required.
        patternProperties: enumSchema([ 'name', 'auditor', 'reviewer' ], {
          also: {
            properties: {
// STOPPED HERE: reviewing how I intended to use the "known" keyword to distinguish
// CanadaGAP typical audit from others...
              auditor: { 
            }
          }
        ),
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
  
    // Total score (preliminary and final) for this audit
    score: vocab('score'), 
  
    // This part describes the overall structure of the document.  Odds are good that all PrimusGFS harvest crew reports
    // have the same sections and control points.  Note that a section may contain other sections, or it may contain control pointids.
    sections: vocab('sections'),
  
    // All the control points, regardless of section, go in this part.  Key is the 
    // control_pointid for that question
    control_points: vocab('control_points'),
  
  },
});
            
