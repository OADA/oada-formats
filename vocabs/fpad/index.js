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
var libvocab = require('../../lib/vocab')('fpad'); // vocab module is 'fpad'
var register = libvocab.register;
var enumSchema = libvocab.enumSchema;
var vocab = libvocab.vocab;
var sameAs = libvocab.sameAs;

// Note that the 'vocab()' function is what this module exports.  It is
// defined in libvocab, and is how you should interact with the vocab built
// here.


//----------------------------------------------------------------------------
// Scheme info:
//----------------------------------------------------------------------------

register('name', {
  description: 'name is a string, typically the name of the object the key '+
                'appears in.',
  type: 'string',
});

register('description', {
  description: 'a string description of an object, usually longer than "name"',
  type: 'string'
});

register('version', {
  description: 'version is a string which describes the version of the schema '+
                'used for the current audit.',
  type: 'string',
});


register('scheme', {
  description: 'the set of descriptors for identifying the current audit scheme '+
                'for this document.',
  propertySchema: enumSchema([
    'name', 'version',
  ])
});

register('registration_number', {
  description: '"registration_number" is the number given to the certifying body '+
                'when they register with the scheme owner.',
  type: 'string',
});



//----------------------------------------------------------------------------
// Certifying Body info:
//----------------------------------------------------------------------------

register('person', {
  description: 'person is a key that never appears anywhere, but anywhere a person-type '+
                'of thing exists (auditor, contact, etc.) it is one of these things.',
  propertySchema: enumSchema([
    'name',
  ])
});

register('auditor', sameAs('person', {
  description: '"auditor" is the person performing the audit for the certifying '+
                'body',
}));

register('certifying_body', {
  description: 'specifies the credentials of the '+
                'organization is performing the audit along with the specific individual '+
                'performing the audit.',
  propertySchema: enumSchema([
    'registration_number', 'name', 'auditor',
  ]),
});

register('contact', sameAs('person', {
  description: 'contact describes an individuals who may be contacted in '+
                'reference to this audit.',
}));

register('contacts', {
  description: 'contacts is a list of contact people for an organization.',
  type: 'array',
  items: vocab('contact'),
});

register('primus_gfs_id', {
  description: 'This id registers the combined organization and a set of '+
                'products with PrimusGFS.',
  type: 'string',
});

register('certification_number', {
  description: 'consecutive audits under the same primus_gfs_id are assigned a '+
               '"certification" number that increments by one with each audit.',
  type: 'string',
});



//----------------------------------------------------------------------------
// Organization info:
//----------------------------------------------------------------------------

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

register('phone', {
  description: 'phone describes the phone number with country code and area '+
                'code.',
  type: 'string',
});

register('location', {
  description: 'location describes the postal address used to identify where '+
                'something is.',
  propertySchema: enumSchema([
    'postal_code', 'street_address', 'city', 'state', 'country',
  ]),
});

register('organization', {
  description: 'organization contains information about the organization under '+
                'audit.',
  propertySchema: enumSchema([
    'name', 'contacts', 'location', 'phone',
  ]),
});



//----------------------------------------------------------------------------
// Scope of audit:
//----------------------------------------------------------------------------

register('product', {
  description: 'product describes the particular type of item being evaluated in '+
                'the audit. May describe the fruit, vegetable, etc. as well as other descriptors '+
                'such as "chopped", "pitted", "organic", etc.',
  propertySchema: enumSchema([
    'name',
  ]),
});

register('products_observed', {
  description: 'The set of products evaluated in the audit.',
  type: 'array',
  items: vocab('product'), // TODO: need a means of listing known product names
});

register('similar_products_not_observed', sameAs('products_observed', {
  description: 'array of products not under evaulation that may be similar to '+
                'those observed in the audit.',
}));

register('products_applied_for_but_not_observed', sameAs('products_observed', {
  description: 'array of products that had been applied for but are not under '+
               'evaulation in this particular audit.',
}));

register('operation_type', enumSchema({
  description: 'type of a given operation',
  type: 'string',
  known: [ 'Harvest Crew', 'Packinghouse', 'Cold Storage' ],
}));

register('shipper', {
  description: 'shipper is the parent organization who will be responsible for '+
                'moving the product(s) to their next destination.',
  propertySchema: enumSchema([
    'name',
  ]),
});

register('crew', {
  description: 'crew is used to detail the information about operations of type '+
                '"Harvest Crew". For facility-related operation types, the "crew" key is replaced '+
                'by the "facility" key.',
  propertySchema: enumSchema([
    'contacts', 'name', 'location',
  ]),
});


register('operation', {
  description: 'an object describing the operation that is under audit',
  propertySchema: enumSchema([
    'operation_type', 'crew', 'shipper'
  ]),
});

register('scope', {
  description: 'scope describes the breadth of the audit in terms of operations, '+
                'personnel, products, etc.',
  propertySchema: enumSchema([
    'description', 'operation', 'products_observed',
    'similar_products_not_observed', 'products_applied_for_but_not_observed',
  ]),
});

register('start', {
  description: 'start describes the date and time when the audit started',
  type: 'string',
});

register('end', {
  description: 'end describes the date and time when the audit was completed.',
  type: 'string',
});

register('FSMS_observed_date', {
  description: 'the period (beginning and ending times) of the FSMS portion of '+
                'the audit.',
  propertySchema: enumSchema([
    'start', 'end',
  ]),
});

register('operation_observed_date', {
  description: 'the period (beginning and ending times) of the '+
                'walk-through/field operations portion of the audit.',
  propertySchema: enumSchema([
    'start', 'end',
  ]),
});

register('value', {
  description: 'a numeric or qualitative value, represented as a string',
  type: 'string',
});

register('units', {
  description: 'the units used to interpret the associated value.',
  type: 'string',
});

register('compliance', {
  description: 'written description indicating the level of satisfaction of the '+
                'control point. E.g., "Total Compliance", "Minor Deficiency", or simply '+
                '"Pass"/"Fail".',
  type: 'string',
});

register('possible', sameAs('value', {
  description: 'Number of points possible for this control point',
}));

register('datum', {
  description: 'A datum is not a key that likely appears anywhere, but other '+
                'vocab terms all use the form of a datum: a thing with a value, '+
                'units, and optionally a \'possible\' number of points',
  propertySchema: enumSchema([
    'value', 'units', 'possible'
  ]),
});

register('preliminary', sameAs('datum', {
  description: 'A prelimiary score for an audit',
}));

register('final', sameAs('datum', {
  description: 'The final score for an audit',
}));

register('score', sameAs('datum', {
  description: 'score presents the quanititative performance of a control point, '+
                'section, or overall audit.',
  propertySchema: enumSchema([
    'preliminary', 'final', 'value', 'units', 'possible'
  ]),
}));

register('control_pointid', {
  description: 'control_pointid is the id associated with a particular control '+
                'point.',
  type: 'string',
  pattern: '*',
});

register('control_pointids', {
  description: 'control_pointids lists the array of control point ids associated '+
                'with the given section.',
  type: 'array',
  items: vocab('control_pointid'),
});

register('sectionid', {
  description:  'sectionid is the string id associated with a particular '+
                 'section. sectionid is constructed by prefixing the id with any parent sections, '+
                 'separated by periods (e.g., sectionid \'2.3\' is a section that is inside of a '+
                 'parent section with sectionid \'2\').',
  type: 'string',
});

register('section', {
  description: 'a section is a recursively defined partition of the audit, meaning '+
                'that it may contain other "child" sections within it.',
  propertySchema: enumSchema([
    'name', 'sectionid', 'score', 'control_pointids', 
  ]),
  properties: {
    'sections': { }, // recursively defined, so it doesn't exist yet.
  },
});

register('sections', {
  description: 'sections is a list of sections objects, used for organizing '+
               'control points into groupings.',
  type: 'array',
  items: vocab('section'),
});

register('comments', {
  description: 'comments from an auditor on a particular control point',
  type: 'string',
});

register('url', {
  description: 'a string representing a URL link',
  type: 'string',
});

register('file', {
  description: 'an object with a url at the moment, perhaps more complex later.',
  propertySchema: enumSchema([
    'url',
  ]),
});

register('files', {
  description: 'a list of file URL\'s that go with a particular control point',
  type: 'array',
  items: vocab('file'),
});

register('control_point', {
  description: 'control_point is a single question/item to be addressed by the '+
                'auditor.',
  propertySchema: enumSchema([
    'name', 'score', 'comments', 'files',
  ]),
});

register('control_points', {
  description: 'control_points is a key that contains the complete set of '+
                'control points within an audit. Each control point is indexed by its '+
                'control_pointid. This key is a top level key for ease of accessing any/all control '+
                'points. No prior knowledge of section structure is therefore necessary to look up '+
                'a particular control point of interest.',
  propertySchema: vocab('control_pointid'),
  propertySchemaDefault: vocab('control_point'),
});

vocab.enumSchema = enumSchema; // oadaSchema function needs access to enumSchema
module.exports = vocab;
