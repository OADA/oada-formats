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
//   if the property is not a known vocab term, it uses this schema for all those
//   properties.  Necessary for patternProperties.

// Since some terms below want to re-use other terms, the terms are defined
// one-at-a-time in reverse order.  The terms at the top are used by others,
// terms defined later are likely not used by others.

//---------------------------------------------------------------------------------


var _ = require('lodash');
var libvocab = require('../../lib/vocab');
var register = libvocab.register;
var enumSchema = libvocab.enumSchema;
var vocab = libvocab.vocab;
var sameAs = libvocab.sameAs;

// Note that the 'vocab()' function is what this module exports.  It is
// defined in libvocab, and is how you should interact with the vocab built here.


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// basic terms:
//----------------------------------------------------------------------------

register('name', {
  description: `name is a string specifying how a to refer to a given object.`,
  type: 'string',
});

register('primus_gfs_id', {
  description: ``,
  type: 'string',
});

register('contacts', {
  description: `contacts is a list of names.`,
  type: 'array',
});

register('phone', {
  description: `phone describes the phone number with country code and area code.`,
  type: 'string',
});

register('registration_number', {
  description: `"registration_number" is the number given to the certifying body
        when they register with the scheme owner.`,
  type: 'string',
});

register('version', {
  description: `version describes the the version of the audit being performed`,
  type: '',
});

register('products_observed', {
  description: ``,
  type: '',
});

register('auditor', {
  description: `"auditor" is the person performing the audit for the certifying
        body`,
  propertySchema: enumSchema([
    'name',
  ]),
});

// Not sure on the certification id
register('certification_id', {
  description: ` `,
  type:
})

register('certification_body', {
  description: `The "certification_body" specifies the credentials of the
  organization who is performing the audit along with the specific individual
  performing the audit`,
  propertySchema: enumSchema([
    'registration_number', 'name', 'auditor', 'certification_id',
  ]),
});

register('organization', {
  description: `organization describes contact information about the entity
being audited.`,
  propertySchema: enumSchema([
    'name', 'contacts', 'location', 'phone'
  ]),
});

//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Enumerated things:
//------------------------------------------------------------------------

register('products_observed', {
  description: `the product(s) under scrutiny for the current audit, e.g.,
"Tomatoes"`,

});

//------------------------------------------------------------------------
// End of known terms, here are helpful functions used above:
//------------------------------------------------------------------------

vocab.enumSchema = enumSchema;
module.exports = vocab;
