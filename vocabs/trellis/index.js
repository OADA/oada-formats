//---------------------------------------------------------------------------------
// The purpose of "vocab" is to have a bunch of re-usable terms that
// all have a common set of "known" things defined under them.  This becomes
// the "vocabulary" assuming the overall set of schemas is properly
// duck-typed: i.e. a particular word means the same thing no matter
// where it is used.

// Each entry in the _vocab object below represents a valid JSONSchema
// for a term.  It would be a good idea to review the JSONSchema v4 language
// before reading this file.  Here's a good intro:
// https://spacetelescope.github.io/understanding-json-schema/

// I added three things to the normal JSONSchema v4 language which makes
// this work better for us at OADA:
// - 'known': used in enumerated types that have some known values,
//   but using other values does not break the schema unless you are
//   validating in strict mode.  This lets us store the know list of
//   crop-types, units, etc. here and use them when testing if needed.
// - 'propertySchema': If you build an object which has properties that
//   are just other vocab terms, you can just write them as an enumSchema
//   and let the propertySchemaToProperties function fill in the rest for you.
//   It's necessary because some things need to be able to match all the keys
//   of a given vocab term as their values.
// - 'propertySchemaDefault': when creating properties from the propertySchema,
//   if the property is not a known vocab term, it uses this schema for all
//   those
//   properties.  Necessary for patternProperties.

// Since some terms below want to re-use other terms, the terms are defined
// one-at-a-time in reverse order.  The terms at the top are used by others,
// terms defined later are likely not used by others.

//---------------------------------------------------------------------------------


var _ = require('lodash');
var libvocab = require('../../lib/vocab')('trellis'); // vocab module is 'trellis'
const {register,enumSchema,vocab,vocabToProperties,override,patterns} = libvocab;

//----------------------------------------------------------------------------
// Top-level key: certifying_body
//----------------------------------------------------------------------------

register('name', {
  description: 'name is a string, typically the name of the object the key '+
                'appears in.',
  type: 'string',
  pattern: patterns.indexSafePropertyNames, // just ensures that id's don't conflict with reserved keywords, *-index's, and context
});

register('phone', {
  description: 'phone describes the phone number with country code and area '+
                'code.',
  type: 'string',
});

register('fax', {
  description: 'fax number for a person or organization',
  type: 'string',
});

register('email', {
  description: 'email address for an organization or contact',
  type: 'string',
});

register('street_address', {
  description: 'The street name and mailbox number of a postal address.',
  type: 'string',
});

register('postal_code', {
  description: 'postal_code is the postal code used in a postal address',
  type: 'string',
});

register('city', {
  description: 'The name of the city, usually in a postal address.',
  type: 'string',
});

register('state', {
  description: 'The name of the state or major region, usually in a postal address.',
  type: 'string',
});

register('country', {
  description: 'The name of the country, usually in a postal address.',
  type: 'string',
});

register('location', {
  description: 'location describes the postal address used to identify where '+
                'something is.',
  properties: vocabToProperties([
    'postal_code', 'street_address', 'city', 'state', 'country',
    'name', // name was added for canadaGAP to refer to the "name of audited location (for multi-site certification)"
  ]),
});

register('person', {
  description: 'person is a key that never appears anywhere, but anywhere a person-type '+
                'of thing exists (auditor, contact, etc.) it is one of these things.',
  properties: vocabToProperties([ 'name', 'email', 'location', 'phone', 'fax' ]),
});

register('conflict_of_interest', {
  description: 'conflict_of_interest indicates if a particular person (auditor) has a '+
               'known conflict of interest for creating a certification for an organization',
  type: 'boolean',
});
register('number_prior_audits_this_organization', {
  description: 'Introduced for CanadaGAP, this is the auditor\'s attestation of how many '+
               'times they have audited this operation before.',
  type: 'string',
  pattern: '^[0-9]+$', // a string that is just a number
});
register('number_prior_consecutive_audits_this_organization', override('number_prior_audits_this_organization', {
  description: 'Introduced for CanadaGAP, this is the auditor\'s attestation of how many '+
               'consecutive times they have audited this operation, excluding the current audit.',
}));

register('auditor', override('person', {
  description: '"auditor" is the person performing the audit for the certifying '+
                'body',
  properties: vocabToProperties([
    'conflict_of_interest', 'number_prior_audits_this_organization', // added all these for CanadaGAP
    'number_prior_consecutive_audits_this_organization',
  ]),
}));

register('reviewer', override('person', {
  description: 'Introduced for CanadaGAP audit.  Represents the person who reviewed the audit '+
               'within the certifiation body.',
}));

register('review_date', {
  description: 'Introduced for CanadaGAP.  Indicates when the review of the audit was performed.',
  type: 'string', // ISO time string like 2018-06-03T13:01:02Z-06:00
});

register('certifying_body', {
  description: 'specifies the credentials of the '+
                'organization is performing the audit along with the specific individual '+
                'performing the audit.',
  properties: vocabToProperties([ 
    'auditor', 'reviewer', 'review_date',
  ], { 
    // known certifying_body names:
    name: override('name', enumSchema([ 'Primus Auditing Operations' ]) ),
  }),
});

//----------------------------------------------------------------------------
// Top-level key: scheme
//----------------------------------------------------------------------------

register('description', {
  description: 'a string description of an object, usually longer than "name"',
  type: 'string'
});

register('version', {
  description: 'version is a string which describes the version of the schema '+
                'used for the current audit.',
  type: 'string',
});

register('option', {
  description: 'option is used as an indicator of type of audit for a given '+
                'audit version.  Introduced for GlobalGAP audit, also present '+
                'in CanadaGAP audit.',
  type: 'string',
});
register('options', {
  description: 'If an audit covers multiple scheme options, you can make an array of them.',
  type: 'string',
});

register('module', {
  description: 'module is not a key that is used anywhere, but each item in '+
               'the modules array should look like a module defined here.',
  properties: {
    name: override('name', enumSchema([
      // These are the currently-known module names:
      'All Farm Base', 'Crops Base', 'Fruit and Vegetables' 
    ])),
  }
});

register('modules', {
  description: 'modules is an array of object whose names describe the various modules '+
               'of which this audit is comprised.  It currently is only known to exist '+
               'in GlobalGAP audits.',
  items: vocab('module'),
});

register('scheme', {
  description: 'the set of descriptors for identifying the current audit scheme '+
                'for this document.',
  properties: vocabToProperties([ 'version', 'option', 'options' ], {
    // known names of scheme owners:    
    name: override('name', enumSchema([ 
      'PrimusGFS', 'GlobalGAP', 'CanadaGAP', 'SQFI' 
    ])),
  }),
});


//----------------------------------------------------------------------------
// id's:
//----------------------------------------------------------------------------

register('id', { 
  description: 'An id is a string which should be reasonably unique to represent the '+
               ' object it belongs to.',
  type: 'string',
  pattern: patterns.indexSafePropertyNames, // just ensures that id's don't conflict with reserved keywords, *-index's, and context
});

register('id_source', {
  description: 'An id_source is a representation of who assigned the id: i.e. who do you '+
               'go ask to figure out what a particular ID goes to.',
  properties: vocabToProperties([ 'certifying_body', 'scheme' ]),                    // one of these strings
});

register('sourced_id', {
  description: 'A sourced_id is not used directly, but rather is the template for '+
               'things like organizationid and certificationid.',
  properties: vocabToProperties([
    'id', 'id_source', 
  ]),
});

register('certificationid', override('sourced_id', {
  description: 'certificationid is an id which spans all documents for a single certification '+
               'process.  i.e. the audit, corrective actions, and final certificate all share '+
               'the same certificationid',
}));

// Basic data:
register('value', {
  description: 'a numeric or qualitative value, represented as a string',
  type: 'string',
});

register('units', {
  description: 'the units used to interpret the associated value.',
  type: 'string',
});



//----------------------------------------------------------------------------
// Top-level key: organization
//----------------------------------------------------------------------------
register('contact_type', enumSchema({
  description: 'Indicates if this particular contact person has some special role '+
               'in the organization such as "Food Safety Program Coordinator" or '+
               '"Recall Coordinator."  Introduced for CanadaGAP Audit',
  type: 'string',
  known: [ 'Food Safety Program Coordinator', 'Recall Coordinator', 'Responsible For Operation' ],
}));
register('contact_types', {
  description: 'Allows one person to be multiple contact types.  Introduced for CanadaGAP audits.',
  type: 'array',
  items: vocab('contact_type'),
});
register('contact', override('person', {
  description: 'contact describes an individuals who may be contacted in '+
                'reference to this audit.',
  // adds contact_type and contact_types to the properties from 'Person'
  properties: vocabToProperties([ 'contact_type', 'contact_types' ]),
}, { mergePropertiesInsteadOfReplace: true }));

register('contacts', {
  description: 'contacts is a list of contact people for an organization.',
  type: 'array',
  items: vocab('contact'),
});

register('organizationid', override('sourced_id', {
  description: 'organizationid identifies the organization which is the subject of the '+
               'audit/certification.',
}));

register('GLN', {
  description: 'A Global Location Number, assigned by GS1.  Usually exists in "organization".',
  type: 'string',
  pattern: '^[0-9]{13}$', // 13 digits
});

register('otherids', {
  description: 'otherids represents an array of alternative sourced id\'s for a given '+
               'object.  Introduced for GlobalGAP since the scheme owner (GlobalGAP) '+
               'has an ID for an organization, and the certifying body also has an '+
               'ID for an organization.  The main ID (for the scheme owner) should '+
               'go in the regular organizationid field, but the certifying_body\'s '+
               'ID should go in this otherids field.',
  items: vocab('organizationid'),
});

register('job_title', {
  description: 'The title of this person within their organization.',
  type: 'string',
});

register('job_description', {
  description: 'A description of what this person does or is responsible for within '+
               'an organization.',
  type: 'string',
});

register('reports_to', {
  description: 'An array of all the ID strings of the people to whom this person reports',
  type: 'array',
  items: vocab('id'),
});

register('orgchart_person', override('person', {
  description: 'An orgchart_person has all the possible properties of a person, '+
               'but also can have job_title, job_description, and reports_to.',
  properties: vocabToProperties(['job_title', 'job_description', 'reports_to' ]),
}));

register('orgchart', {
  description: 'orgchart is a tricky one.  It is intended to represent the reporting '+
               'structure within an organization.  Introduced for the CanadaGAP audit. '+
               'It is a flat object with keys that represent the "id" of a person.  Each '+
               'value in this outer object is a single person, and may have name, job_title, and '+
               'job_description.  If this person reports to someone else, the reports_to '+
               'key should be included in their object as well (an array of all the people '+
               'they report to), thus creating a directed graph of relationships.',
  patternProperties: {
    '*': vocab('orgchart_person')
  },
});

register('organization', {
  description: 'organization contains information about the organization under '+
                'audit.',
  properties: vocabToProperties([
    'organizationid', 'GLN', 'name', 'contacts', 'location', 'phone', 'fax', 'orgchart',
  ]),
});



////////////////////////////////////////////////////////////////////
// Top-level key: scope
////////////////////////////////////////////////////////////////////

register('notification', {
  description: 'notification describes whether the target of the audit was notified in '+
               'advance that this audit would take place.  "announced" or "unannounced".',
  type: 'string',
  value: enumSchema(['announced', 'unannounced' ]),
});

register('organic', {
  description: 'organic is a true/false value indicating if a particular product is considered '+
               'organic or not.',
  type: 'boolean'
});

register('area', {
  description: 'area describes a quantity of area such as acres or hectares.',
  properties: vocabToProperties(
    ['value'], // area has value and units, units restricted to acres, hectares
    { units: override('units', enumSchema(['acres', 'ac', 'hectares', 'ha'])) }
  ),
});

register('product', {
  description: 'product describes the particular type of item being evaluated in '+
                'the audit. May describe the fruit, vegetable, etc. as well as other descriptors '+
                'such as "chopped", "pitted", "organic", etc.',
  // the "product" object has a name key (below), but also can have
  // organic, area, and location keys (for GlobalGAP).  That is the difference
  // between propertySchema and the regular properties.
  properties: vocabToProperties([ 
    'organic', 'area', 'location', // from GlobalGAP
  ], { 
    name: override('name', enumSchema(
      // these are just the known possible products and the set here should never
      // be considered exhaustive.  Pull requests welcome to build out this list.
      [ 'tomatoes', 'peppers', 'zucchini' ],
    ))
  }),
});

register('products_observed', {
  description: 'The set of products evaluated in the audit.',
  type: 'array',
  items: vocab('product'),
});

register('similar_products_not_observed', override('products_observed', {
  description: 'array of products not under evaulation that may be similar to '+
                'those observed in the audit.',
}));

register('products_applied_for_but_not_observed', override('products_observed', {
  description: 'array of products that had been applied for but are not under '+
               'evaulation in this particular audit.',
}));

register('operation_type', enumSchema({
  description: 'type of a given operation',
  type: 'string',
  known: [ 'harvest', 'packinghouse', 'cold storage',
           'growing', 'handling',  // added these two for GlobalGAP, which also has harvest
           'u-pick', 'storage', 'packing - production site', // added six more here from CanadaGAP
           'repacking', 'brokerage', 'wholesale'],
}));

register('shipper', {
  description: 'shipper is the parent organization who will be responsible for '+
                'moving the product(s) to their next destination.',
  properties: vocabToProperties(['name']),
});

register('operator', {
  description: 'operator is used to detail the information about the crew or on-site operators '+
               'for a given operation.',
  properties: vocabToProperties([
    'contacts', 'name', 'location',
  ]),
});

register('operation', {
  description: 'an object describing the operation that is under audit. '+
               'For GlobalGAP, this is just an object with a name.  For '+
               'PrimusGFS, this is holds description',
  properties: vocabToProperties([
    'operation_type', 'operator', 'shipper', 'location', 'name',
  ]),
});
register('operations', {
  description: 'An audit that covers multiple type of operations (packing, harvest, etc.) '+
               'can have an array of operations instead of just one.',
  type: 'array',
  items: vocab('operation'),
});
register('operations_applied_for_but_not_observed', override('operations', {
  description: 'Introdued for CanadaGAP audit.  Refers to activities that the audit '+
               'will cover but were not observed during the audit.',
}));

register('production_site', {
  description: 'A production_site is defined for GlobalGAP and describes the products '+
               'grown, harvested, or handled at multiple locations for the same audit.',
  properties: vocabToProperties([ 'name', 'id', 'products_observed' ]), // id is the Ranch ID in GlobalGAP
});

register('production_sites', {
  description: 'production_sites is an array of object, each of which are a production site.',
  items: vocab('production_site'),
});

register('parallel_production', {
  description: 'parallel_production is defined for GlobalGAP as to whether the site '+
               'is growing other things in addition to those under audit.',
  type: 'boolean',
});

register('parallel_ownership', {
  description: 'parallel_ownership is defined for GlobalGAP as to whether the site '+
               'is growing things owned by someone other than the party under audit',
  type: 'boolean',
});

register('applicable_sites_description', {
  description: 'Introduced for CanadaGAP, this holds a free-form string describing which  '+
               'types of sites this audit applies to.',
  type: 'string',
});

register('is_multisite', {
  description: 'Introduced for CanadaGAP, this is a true/false that indicates if operation '+
               'is multi-site.',
  type: 'boolean'
});

register('scope', {
  description: 'scope describes the breadth of the audit in terms of operations, '+
                'personnel, products, etc.',
  properties: vocabToProperties([
    'description', 'notification', 'operation', 'products_observed',
    'similar_products_not_observed', 'products_applied_for_but_not_observed',
    'production_sites', 'parallel_production', 'parallel_ownership', // introduced for GlobalGAP
    'applicable_sites_description', // introduced for CanadaGAP
  ]),
});


//------------------------------------------------------------------
// Conditions at the time of audit:
//------------------------------------------------------------------

register('start', {
  description: 'start describes the date and time when the audit started',
  type: 'string', // ISO time string like 2018-06-03T13:01:02Z-06:00
});

register('end', {
  description: 'end describes the date and time when the audit was completed.',
  type: 'string', // ISO time string like 2018-06-03T13:01:02Z-06:00
});

register('duration', {
  description: 'duration describes how long an audit took to perform.  Introduced for '
              +'GlobalGAP audits since that is how they specify it instead of start/end.',
  properties: vocabToProperties([
    'value'
  ], { 
    units: override('units', enumSchema(['hours']))
  }), // hours are known units for duration
});

register('FSMS_observed_date', {
  description: 'the period (beginning and ending times) of the FSMS portion of '+
                'the audit.',
  properties: vocabToProperties([
    'start', 'end', 'duration',
  ]),
});

register('operation_observed_date', {
  description: 'the period (beginning and ending times) of the '+
                'walk-through/field operations portion of the audit.',
  properties: vocabToProperties([
    'start', 'end', 'duration',
  ]),
});

register('individuals_present', {
  description: 'List of people present during the audit (part of conditions_during_audit)',
  type: 'array',
  items: vocab('person'),
});

register('audit_duration_rationale', {
  description: 'Introduced for CanadaGAP, this is a free-form string explaining why '+
               'the duration of an audit does not meet the minimum duration requirements.',
  type: 'string',
});

register('conditions_during_audit', {
  description: 'describes conditions when the audit took place.  Date audit started/finished, etc.',
  properties: vocabToProperties([ 
    'FSMS_observed_date', 'operation_observed_date', 'individuals_present', 'audit_duration_rationale',
  ]),
});

////////////////////////////////////////////////////////////////////
// Top-level key: previous_certification
////////////////////////////////////////////////////////////////////

register('previous_certification', {
  description: 'Introduced for CanadaGAP.  This represents information about the previous certificate '+
               'and audit that the operation/organization has on file.  For CanadaGAP, it is supposed '+
               'to be the previous CanadaGAP certificate/audit info, not just any previous info.',
  properties: vocabToProperties([
    'conditions_during_audit', 'certifying_body', 'certificationid', 'scheme', 'scope',
  ]),
});



register('compliance', {
  description: 'written description indicating the level of satisfaction of the '+
                'control point. E.g., "Total Compliance", "Minor Deficiency", or simply '+
                '"Pass"/"Fail".',
  type: 'string',
});

register('possible', override('value', {
  description: 'Number of points possible for this control point',
}));

register('datum', {
  description: 'A datum is not a key that likely appears anywhere, but other '+
                'vocab terms all use the form of a datum: a thing with a value, '+
                'units, and optionally a \'possible\' number of points',
  properties: vocabToProperties([
    'value', 'units', 'possible'
  ]),
});

register('is_compliant', {
  description: 'GlobalGAP has an overall true/false compliance for an audit score',
  type: 'boolean',
});

register('yes', override('datum', {
  description: 'yes is used to represent the summary count of "yes" answers in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('no', override('datum', {
  description: 'no is used to represent the summary count of "no" answers in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('n_a', override('datum', {
  description: 'n_a is used to represent the summary count of "Not Applicable" answers '+
               'in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('major_must', override('datum', {
  description: 'major_must is used to represent the summary count of "Major Must" answers '+
               'in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('minor_must', override('datum', {
  description: 'major_must is used to represent the summary count of "Minor Must" answers '+
               'in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('recommended', override('datum', {
  description: 'major_must is used to represent the summary count of "Minor Must" answers '+
               'in the audit',
  properties: { 
    units: override('units', enumSchema(['count']) ),
  }
}, { mergePropertiesInsteadOfReplace: true }));

register('globalgap_level', {
  description: 'globalgap_level is not actually a key that is used, but rather '+
               'describes a class of objects which represent a level\'s summary '+
               'score',
  anyOf: [
    { properties: vocabToProperties(['yes', 'no', 'n_a', 'is_compliant' ]), },
    { properties: vocabToProperties(['major_must', 'minor_must', 'recommended']) },
  ],
});

register('minor_musts', override('globalgap_level', {
  description: 'The summary score for all minor-must level questions',
}));

register('major_musts', override('globalgap_level', {
  description: 'The summary score for all major-must level questions',
}));

register('globalgap_levels', {
  description: 'GlobalGAP has particular levels of major_musts and minor_must that '+
               'are entirely unique to GlobalGAP, hence the name.',
  properties: vocabToProperties(['major_musts', 'minor_musts'])
});

register('preliminary', override('datum', {
  description: 'A prelimiary score for an audit',
}));

register('final', override('datum', {
  description: 'The final score for an audit',
}));

register('canadagap_isautofail', {
  description: 'If the audit is scored as autofail, this key should be set to '+
               'true in the score section.  Otherwise it can either be missing '+
               'or set to false.  Specific to CanadaGAP',
  type: 'boolean',
});

register('score_core', override('datum', {
  description: 'Do not use score_core in an audit schema.  It exists to avoid '+
               'recursive definition of score and subtotals.',
  properties: vocabToProperties([
    'preliminary', 'final', 'value', 'units', 'possible', 'compliance',
    'globalgap_levels', 'canadagap_isautofail',
  ], {
    units: override('units', enumSchema([ // known score audits:
      'n/a',            // n/a is only possible option if units are set to n/a
      'yes-no',         // yes | no
      'yes-no-n_a',     // yes | no | n_a
      'yes-no-n_a-inc', // yes | no | n_a | inc (incomplete)  introduced for CanadaGAP
      'count', 
      'number',         // must be a string (so signatures work across platforms), but the string is a number
      'points',         // value with be a string number ('4.0') and can also be the string 'n/a'
      '%',
      'text',           // free-form text entry
    ])),
  }),
}));

register('weighting_factor', {
  description: 'Introduced for CanadaGAP.  Represents the weight used to combine sections '+
               'into a total score.',
  type: 'string', // must be a string for signatures to work appropriately
  pattern: '^-?[0-9]+(.[0-9]+)?', // formatted as a number
});

// Had to move sectionid up here above subtotals because the subtotal can contain the sectionid strings.
register('sectionid', {
  description:  'sectionid is the string id associated with a particular '+
                 'section. sectionid is constructed by prefixing the id with any parent sections, '+
                 'separated by periods (e.g., sectionid \'2.3\' is a section that is inside of a '+
                 'parent section with sectionid \'2\').  Note that CanadaGAP also has '+
                 'a special sectionid of "autofail" for their autofail items.  All other sectionids '+
                 'that we have seen are of the form '+
                 '<number_or_letter>.<number_or_letter>.<number_or_letter>... with 1 or more numbers',
  type: 'string',
});

register('sectionids', {
  description: 'An array of section id strings that '+
               'belong to a subtotal or a sub-section.',
  type: 'array',
  items: vocab('sectionid'),
});



register('subtotals', {
  description: 'Introduced for CanadaGAP.  Represents the sub totals for various combinations '+
               'of sections as specified by CanadaGAP, as well as the weighting_factor for that '+
               'combination of sections toward the overall score.  This is needed because the '+
               'subtotals do not perfectly match the sections, so it exists here as a separate '+
               'key.  Other audits should just put the subtotal under the section that it goes '+
               'with.',
  properties: vocabToProperties([
    'name', 'sectionids', 'weighting_factor'
  ], {
    score: vocab('score_core'), // avoids recursive definition
  }),
});

register('score', override('score_core', {
  description: 'score presents the quanititative performance of a control point, '+
               'section, or overall audit.',
  properties: vocabToProperties([ 'subtotals' ]), // adds subtotals to set of possible keys
}, { mergePropertiesInsteadOfReplace: true }));   // introduced for CanadaGAP.

register('certificate_validity_period', {
  description: 'certificate_validity_period denotes the period of time (beginning date'+
              ' to end date) through which the audit is valid.',
  type: 'string',
  pattern: '*',
})

register('organization_response', {
  description: 'organization_response is the organizations response to a non-compliant '+                              
               'control point.',
  type: 'string',
  pattern: '*', 
})      
      
register('organization_comments', {                                                                                   
  description: 'organization_comments contain any additional comments or directions '+                                
               'regarding their solution for the failed control point.',                                              
  type: 'string',
  pattern: '*',                                                                                                       
})      
      
register('decision', {                                                                                                
  description: 'decision is the certifying bodys determination for whether the organizations '+                        
               'corrective actions are satisfactory.',
  properties: vocabToProperties([
    'value', 'units'                                                                                                  
  ]),   
})   


register('url', {
  description: 'a string representing a URL link',
  type: 'string',
});

register('file', {
  description: 'an object with a url at the moment, perhaps more complex later.',
  properties: vocabToProperties([ 'url' ]),
});

register('files', {
  description: 'a list of file URL\'s that go with a particular control point',
  type: 'array',
  items: vocab('file'),
});


register('corrective_action', {                                                                                       
  description: 'corrective_action is the corrective action details associated with '+
               'a particular control point as found in the corrective actions report.',                               
  properties: vocabToProperties([                                                                                        
    'score', 'organization_response', 'organization_comments', 'decision', 'files',                                             
  ]), 
}); 

libvocab.setPattern('controlPointid', patterns.indexSafePropertyNames);
register('control_pointid', {
  description: 'control_pointid is the id associated with a particular control '+
                'point.',
  type: 'string',
  pattern: patterns.controlPointid,
});

register('control_pointids', {
  description: 'control_pointids lists the array of control point ids associated '+
                'with the given section.',
  type: 'array',
  items: vocab('control_pointid'),
});

libvocab.setPattern('supportingPointid', patterns.indexSafePropertyNames);
register('supporting_pointid', {
  description: 'A supporting_pointid is a string that uniquely identifies a '+
               'supporting_point within a control point\'s list of supporting_points.  '+
               'It should look something like "A.1.1".  It should be the control_pointid, '+
               'then a period, then a number indicating the order of this supporting_point '+
               'within this control_point',
  type: 'string',
  pattern: patterns.supportingPointid,
});

register('supporting_point', {
  description: 'A supporting point is a sub-point within a control point.  This was introduced '+
               'for CanadaGAP to represent all the checkboxes under the control points.  It is '+
               'just an object with a name and a score.',
  properties: vocabToProperties([
    'name', 'score',
  ]),
});

register('supporting_points', {
  description: 'supporting_points is just an object whose keys are supporting_pointids, and whose '+
               'values are supporting_point objects.',
  patternProperties: {
    [patterns.supportingPointid]: vocab('supporting_point'),
  },
});

register('auditor_comments', {
  description: 'Free-form text comments from the auditor for a particular control point or section.',
  type: 'string',
  pattern: '*',
});

register('section', {
  description: 'A section is a recursively defined partition of the audit, meaning '
              +'that it may contain other "child" sections within it.  If it is a specialized '
              +'sub-section that does not follow a clean hierarchy, it may use the sectionids '
              +'key to state which other sections belong to this section.  Introduced the sectionids '
              +'for CanadaGAP to handle the sub-total sections of A1-3 and A4-5.',
  properties: vocabToProperties([
    'name', 'sectionid', 'score', 'sectionids', 'control_pointids', 'supporting_points', 'auditor_comments',
  ], { sections: {} }), // sections is recursively defined, so it doesn't exist yet
});

register('sections', {
  description: 'sections is a list of section objects, used for organizing '+
               'control points into groupings.',
  type: 'array',
  items: vocab('section'),
});

register('comments', {
  description: 'comments from an auditor on a particular control point',
  type: 'string',
});

register('justification', {
  description: 'justification is an explanation by the auditor of why they scored a '+
               'control_point the way they did',
  type: 'string',
});

register('criteria', {
  description: 'criteria is an arrray of strings representing the various criteria '+
               'needed for the certifying body to pass/fail a given control point',
  items: { type: 'string' },
});

register('control_point', {
  description: 'control_point is a single question/item to be addressed by the '+
                'auditor and represents the core set of scores which are used for the audit.',
  properties: vocabToProperties([
    'name', 'score', 'comments', 'files', 'justification', 'criteria', 'globalgap_level', 
    'auditor_comments', 'supporting_points',
  ]),
});

register('control_points', {
  description: 'control_points is a key that contains the complete set of '+
                'control points within an audit. Each control point is indexed by its '+
                'control_pointid. This key is a top level key for ease of accessing any/all control '+
                'points. No prior knowledge of section structure is therefore necessary to look up '+
                'a particular control point of interest.',
  patternProperties: {
    [patterns.controlPointid]: vocab('control_point'),
  },
});


//-------------------------------------------------------------
// Known indexing:
//-------------------------------------------------------------

register('id-index', {
  description: 'An id-index is a means to split up a large set of id\'s into smaller sets. '+
               'For example, if the id is "ki02fjkld", an id-index might organize that id '+
               'with all ids that start with ki02.  There are no particular requirements on '+
               'this schema: you should extend it in particular instances to set the schema '+
               'type on the items.',
  patternProperties: {
    [patterns.indexSafePropertyNames]: vocab('link'), // this means that the properties with those patterns are of this type
  },
});

module.exports = libvocab;
