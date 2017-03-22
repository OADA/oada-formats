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
var libvocab = require('../../lib/vocab')('oada');
var register = libvocab.register;
var enumSchema = libvocab.enumSchema;
var vocab = libvocab.vocab;
var sameAs = libvocab.sameAs;

// Note that the 'vocab()' function is what this module exports.  It is 
// defined in libvocab, and is how you should interact with the vocab built here.


//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// Basic terms.  Generally used to build up other terms so they need to be 
// defined here first.
//---------------------------------------------------------------------------

// Data:
register('value', {
  description: 'value is a key which holds a value for a particular type of data point.  For example, '+
         'if your data point has an "area" key, the value at the "area" key is an object with '+
         'a "value" key and a "units" key.  Units can be in the template for the data point, too.',
  anyOf: [ 
    { type: 'string' }, 
    { type: 'number' }, 
    { type: 'boolean' } 
    // Does value ever make sense as an object/array?
  ],
});

register('units', {
  description: 'Known units of things.  Each type of data (below) has its own subset '+
         'of known units defined.  A generic "unit" is just a string.',
  type: 'string',
});

// Stats:
register('sum', {
  description: 'sum represents a sum of numbers.  Used in a stats object.',
  type: 'number',
});

register('count', {
  description: 'count represents a count of data point that contribute to a sum or sum-of-squares.',
  type: 'number',
});

register('sum-of-squares', {
  description: 'sum-of-squares means the sum of the squared values of a set of numbers.  Useful for '+
        'computing a standard deviation.',
  type: 'number',
});


//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Data value types.  i.e. the things that can be in data objects.
//------------------------------------------------------------------------

register('id', {
    description: 'id (note this is NOT "_id") can be used to identify a particular data point, '+
           'perhaps across documents which simply re-index the same data.',
    type: 'string',
});

register('geohash', {
  description: 'A geohash is a base 32 encoded string which represents the combination of '+
         'latitude and longitude into a single number which, in general, has a property '+
         'such that points close in number are close on the globe.',
  type: 'string',
  // doesn't use characters a, i, l, and o
  pattern: '^[0-9bcdefghjkmnpqrstuvwxyz]+$'
});

register('latitude', {
  description: 'latitude is a number',
  type: 'number',
});

register('longitude', {
  description: 'longitude is a number',
  type: 'number',
});

register('altitude', {
  description: 'altitude is a number',
  type: 'number',
});

register('datum', {
  description: 'datum describes the model of the earth used for GPS coordinates.  It can be from a '+
               'set of known strings, or an EPSG model from http://spatialreference.org',
  anyOf: [
    // set of known strings
    { type: 'string', enum: [ 'WGS84' ] }, // others?
    // an unknown string
    { type: 'string'},
    // EPSG object (http://spatialreference.org/ref/epsg/wgs-84/json/)
    {
      required: ['type', 'properties'], 
      properties: {
        // two valid keys in epsg object as 'properties' and 'type'.  Confusing, I know.
        type: { type: 'string', enum: [ 'EPSG' ] },
        properties: { 
          required: [ 'code' ], 
          properties: { code: { type: 'number' } },
        },
      }
    },
  ],
});

register('location', {
    description: 'location represents a point in space, usually a GPS coordinate or geohash',
    additionalProperties: true,
    propertySchema: enumSchema([
      'datum', 'latitude', 'longitude', 'altitude', 'geohash' 
    ]),
});

register('template', { 
    description: 'template sits inside a data point and gives the name of a template '+
           '(key in the templates object) which serves as prototype for a given '+
           'data point.  The full data point is the merge of that template object '+
           'with the data point, with the data point taking precedence in key collisions. '+
           'This is a string because its value is the key in templates, not the template '+
           'itself.',
    type: 'string', // any random string is a templates key
});

register('generic-data-value', {
    description: 'generic-data-value-with-stats does not exist in any document or URL.  It is a generic object '+
           'that serves as a prototype for most data that can live in "data".',
    additionalProperties: true,
    propertySchema: enumSchema(['units', 'value', 'sum', 'count', 'sum-of-squares']),
});

register('moisture', sameAs('generic-data-value', {
    description: 'moisture is a data type which holds a reading of the amount of moisture in a crop. '+
           'It is typically in units of % water (%H2O).',
    properties: {
      // override the default 'units' with these known moisture units:
      'units': enumSchema([ '%H2O' ]),
    },
}));

register('weight', sameAs('generic-data-value', {
    description: 'weight is a data type which holds a reading of weight, as in bushels, lbs, or kg.',
    properties: {
      'units': enumSchema([ 'bu', 'bushels', 'lbs', 'kg' ]),
    },
}));

register('area', sameAs('generic-data-value', {
    description: 'area is a data type which holds a reading of...area...',
    properties: {
      'units': enumSchema([ 'ac', 'acres', 'ha', 'hectares', 'sqft' ] )
    },
}));

register('width', sameAs('generic-data-value', {
  description: 'width is a data type which holds readings of swath width, or other widths of things.',
  properties: {
    'units': enumSchema([ 'ft', 'feet', 'm', 'meters' ]),
  },
}));

register('time', sameAs('generic-data-value', {
  description: 'time is a data type which holds a reading of...time...',
  properties: {
    'units': enumSchema( [ 'unix-timestamp', 'sec' ] ),
  },
}));


//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
// Known enumerated things:
//--------------------------------------------------------------------------

register('crop-type', enumSchema({
    description: 'crop-type is a data type that holds a string representing the name of a type of crop. '+
           'It has the same known values as the possible properties in crop-index.',
    type: 'string',
    // known is a special OADA extension to JSONSchema that enumSchema uses
    // to require a specific set of values if it's running in strict mode.
    known: [ 'corn', 'soybeans', 'wheat' ],
}));


//----------------------------------------------------------------------
//----------------------------------------------------------------------
// Data points (sensor data, yield data, etc.).  i.e. an object
// containing data keys taken from the known terms above.
//----------------------------------------------------------------------

register('data-point', {
    description: 'data-point never appears as a word in any document or URL.  It is a '+
           'general type of object that can hold any type of data.  It represents '+
           'the type of object that can sit under "data" or "templates".',
    propertySchema: enumSchema([ 
      'id', 'location', 'template', 'datum', 'moisture', 'weight',
      'area', 'time', 'crop-type' 
    ]),
});

register('stats', sameAs('data-point', {
    description: 'stats sits at the top of a resource to list stats about the data inside that resource. '+
           'Basic stats are sum, count, sum-of-squares.  The actual keys under stats are data names '+
           'that you have stats for like weight, area, etc.  The same units and data names are valid '+
           'under stats that are valid under data',
}));

register('data', {
    description: 'data is a general key for holding a collection of data points indexed by '+
           'random strings.',
    additionalProperties: true,
    propertySchema: { type: 'string', pattern: '.*' },
    propertySchemaDefault: vocab('data-point'), // each item in the collection is this by default
});

register('templates', sameAs('data', {
    description: 'templates is a general key for holding a collection of data points indexed by '+
           'random strings.  Templates serve as prototypes for data points under "data" keys. '+
           'If you have a piece of information that exists is all or almost all of the data '+
           'points in a particular group of points, you can put the repeated things in templates '+
           'and then just put the name of the template into the data point.  The full data point '+
           'is therefore a merge of the template object and the data point itself, with the data '+
           'point overruling when there are any keys that exist in both objects.  Schema is therefore '+
           'identical to "data".',
}));

register('geohash-data', {
    description: 'geohash-data is much like "geohash-index" except that the geohash strings in '+
           'geohashes are links to resources, whereas in geohash-data the geohash strings '+
           'are actual data points representing data values for that geohash.  This is used '+
           'primarily in tiled-maps.  The allowable values are the same as the values under '+
           '"data"',
    additionalProperties: true,
    propertySchema: vocab('geohash'),
    propertySchemaDefault: vocab('data-point'), // each item in the collection is this by default
});



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// The usual OADA API keys: _id, _rev, _type, _meta
//-----------------------------------------------------------------------

register('_id', { 
    description: '_id identifies a resource in the OADA API.',
    type: 'string',
});

register('_metaid', sameAs('_id', {
  description: '_metaid is the id of a meta document',
}));

register('_type', {
    description: '_type identifies the content-type of a resource in the OADA API and  '+
           'is required for all OADA-defined formats.  It usually looks like '+
           'application/vnd.oada.something.1+json.',
    type: 'string',
});

register('_rev', { 
    description: '_rev is the revision string for a resource in the OADA API.',
    type: 'string', 
    pattern: '^[0-9]+-.+$',
});

// prototypes to make later definitions shorter:
register('meta-versioned-link', {
  description: 'A meta-link is a link specifically to a meta document.  This is just a  '+
         'convenience term to make it simpler to defind the true versioned and '+
         'non-versioned links below',
  required: [ '_metaid', '_rev' ], additionalProperties: true,
  propertySchema: enumSchema(['_metaid', '_rev', '_type']),
});

register('meta-nonversioned-link', {
  description: 'Similar to meta-versioned-link, just without _rev',
  required: [ '_metaid' ], additionalProperties: true,
  propertySchema: enumSchema(['_metaid', '_type']),
});

register('resource-versioned-link', {
  description: 'A resource-link is a link specifically to a resource (not meta).  This is just a  '+
         'convenience term to make it simpler to defind the true versioned and '+
         'non-versioned links below',
  required: [ '_id', '_rev' ], additionalProperties: true,
  propertySchema: enumSchema(['_id', '_rev', '_type']),
});

register('resource-nonversioned-link', {
  description: 'Similar to resource-versioned-link, just without _rev',
  required: [ '_id' ], additionalProperties: true,
  propertySchema: [ '_id', '_type' ],
});


// vocab terms you should use elsewhere for links:
register('versioned-link', {
  description: 'versioned-link is not intended to show up '+
         'in any  URL\'s or documents anyway: it\'s just a prototype of a link.',
  anyOf: [
    vocab('meta-versioned-link'),
    vocab('resource-versioned-link'),
  ],
}); 

register('nonversioned-link', {
  description: 'An oada-link defaults to a versioned link.  It\'s not intended to show up '+
         'in any  URL\'s or documents anyway: it\'s just a prototype of a link.  '+
         'Its schema function expects a list of known resource _type\'s that may '+
         'be linked from a particular key.',
  anyOf: [
    vocab('meta-nonversioned-link'),
    vocab('resource-nonversioned-link'),
  ],
}); 

register('link', {
  anyOf: [
    vocab('versioned-link'),
    vocab('nonversioned-link'),
  ],
});

// _meta is a versioned link:
register('_meta', sameAs('meta-versioned-link', {
  description: '_meta is a link to the meta document for a resources.',
}));



//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// Indexes: these should not be resources themselves, but rather included
// inside other resources.  An index is a way to group information together.
//---------------------------------------------------------------------------

register('crop-index', {
    description: 'crop-index is an object that sits inside other objects and gives links to '+
           'documents based on the name of a particular crop. It\'s known keys are '+
           'also not considered part of the OADA duck-typed language and therefore do '+
           'not appear as vocabulary terms even though they will be in OADA URLs.  This '+
           'is standard for indexes.',
    additionalProperties: true,
    propertySchema: vocab('crop-type'), // all known crop types are valid crop index properties
    propertySchemaDefault: vocab('link'), // each property is set to be a link by default
});

register('geohash-length-index', { 
    description: 'geohash-length-index is an indexing scheme that groups data by geohash string lengths. '+
           'As with all indexes, it is not a document type itself and therefore cannot be '+
           'linked to.',
    additionalProperties: true,
    // all geohash-length-index keys are geohash string lengths: geohash-1, geohash-2, etc.
    // also you can have 'datum' as a valid key.  Each one just links to another resource.
    propertySchema: {
      oneOf: [
        enumSchema([ 'datum' ]),
        { type: 'string', pattern: '^geohash-[1-9][0-9]*$' },
      ],
    },
    propertySchemaDefault: vocab('link'), // each property is set to this by default
});

register('geohash-index', {
    description: 'geohash-index is a key that holds under it a set of geohash keys of a particular '+
           'length.  It is necessary because some geohashes may be legitimate words and '+
           'therefore we need to place all the geohashes specifically under one key. '+
           'This key usually sits at the top-level of a document reached via a geohash-length-index. '+
           'It is intended to hold links to resources containing data that is grouped under '+
           'a particular geohash.',
    additionalProperties: true,
    // geohashes are 1-n length character strings using 0-9 or subset of letters (base32)
    propertySchema: vocab('geohash'),
    propertySchemaDefault: vocab('link'),
});

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Context: all OADA-defined schemas should have this:
//----------------------------------------------------------------------------

register('context', {
  description: '"context" is used for documents to describe their contents, regardless of '+
                'their position in an OADA bookmarks graph.  Typically a particular '+
                'oada resource type will require a particular set of context items to '+
                'exist.  You make a context object by "flattening" the '+
                'logical bookmarks URL for a given type of data, and only including indexing '+
                'schemes in the list.  Do not include the value of an index as a key in context, '+
                'it should only be the value of it\'s indexing scheme\'s key.',
  additionalProperties:true,
  properties: {
         'harvest': enumSchema([ 'as-harvested' ]), 
    'as-harvested': enumSchema([ 'yield-moisture-dataset' ]),
      'tiled-maps': enumSchema([ 'dry-yield-map', 'moisture-map' ]),
              'crop-index': vocab('crop-index').propertySchema, // array of all crop types
    'geohash-length-index': vocab('geohash-length-index').propertySchema,
           'geohash-index': vocab('geohash-index').propertySchema,
  },
}),

//------------------------------------------------------------------------
// End of known terms, here are helpful functions used above:
//------------------------------------------------------------------------

vocab.enumSchema = enumSchema;
module.exports = vocab;
