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

// I added one thing to the normal JSONSchema v4 language which makes 
// this work better for us at OADA:
// - 'known': used in enumerated types that have some known values,
//   but using other values does not break the schema unless you are 
//   validating in strict mode.  This lets us store the known list of 
//   crop-types, units, etc. here and use them when testing if needed.

// Since some terms below want to re-use other terms, the terms are defined
// one-at-a-time in reverse order.  The terms at the top are used by others,
// terms defined later are likely not used by others.

//---------------------------------------------------------------------------------


var _ = require('lodash');
var libvocab = require('../../lib/vocab')('oada');
const {register, enumSchema, requireValue, vocabToProperties, copySchemaToKeys,
       link, versionedLink, vocab, override, patterns} = libvocab;

//---------------------------------------------------------------------------
// Basic terms.  Generally used to build up other terms so they need to be 
// defined here first.
//---------------------------------------------------------------------------

register('name', {
  description: 'A generic name for something',
  type: 'string',
});

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


register('quantization-level', {
  description: 'An object describing a numeric range, to be used in a quantization-levels array. '+
               'This is not intended to be a term that actually appears as a key, just a descriptor for '+
               'the range objects in the array of levels',
  properties: {
    start: vocab('value'),
    end: vocab('value'),
  },
});

register('quantization-levels', {
  description: 'An array of objects describing a series of numeric ranges that represent a quantization '+
               'scheme.  Belongs inside of a "quantization" object.',
  type: 'array',
  items: vocab('quantization-level'),
});

register('quantization', {
  description: 'quantization is an object describing a quantization scheme: i.e. a set of numeric ranges '+
               'into which a data point\'s value will fall.  It has an underlying unit (i.e. like "Hz" for '+
               'vibration), and then an array of levels.  The data point should then refer to the array index '+
               'of the quantization level its value falls within.  See vibration sensor data for example.',
  properties: vocabToProperties(['units', 'quantization-levels']),
  required: [ 'units', 'quanitzation-levels' ],
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

register('max', {
  description: 'A numeric maximum value',
  type: 'number',
});

register('min', {
  description: 'A numeric minimum value',
  type: 'number',
});

register('mean', {
  description: 'A numeric mean value', 
  type: 'number',
});

register('ave', override('mean', {
  description: 'A numeric average value',
}));

register('std', {
  description: 'A numeric standard deviation value',
  type: 'number',
});

register('inst', {
  description: 'An instantanteous measurement value',
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

register('timestamp', {
  description: 'A unix timestamp in timezone GMT',
  type: 'number',
});

register('time-start', override('timestamp', {
  description: 'A unix timestamp in timezone GMT of when a data reading was started.',
}));

register('time-end', override('timestamp', {
  description: 'A unix timestamp in timezone GMT of when a data reading was completed.',
  type: 'number',
}));

register('rate', {
  description: 'A numeric rate of some measurement, such as rainfall rate.  Can be expressed '+
               'as either a max, min, ave, or a value.',
  properties: vocabToProperties(['units', 'max', 'min', 'ave', 'value']),
});

register('is-freezing', {
  description: 'A true/false indicator of whether current rainfall is freezing into ice or not',
  type: 'boolean',
});

register('depth', {
  description: 'A depth measurement or recording, usually for specifying soil depth for a soil '+
               'moisture sensor.',
  properties: {
    units: override('units', enumSchema([
      'm', 'cm', 'mm', 'ft', 'in'
    ])),
    value: vocab('value'),
  }
});


// doesn't use characters a, i, l, and o
libvocab.setPattern('geohash', '^[0-9bcdefghjkmnpqrstuvwxyz]+$');
register('geohash', {
  description: 'A geohash is a base 32 encoded string which represents the combination of '+
         'latitude and longitude into a single number which, in general, has a property '+
         'such that points close in number are close on the globe.',
  type: 'string',
  pattern: patterns.geohash
});

-.9
0.9
1.9
// numericString is positive or negative, doesn't need leading digit prior to decimal point,
// plain old integers match too, no commas: -.9, 0.9, 1.9, 92039843.9208943, 198283
libvocab.setPattern('numericString', '^-?([0-9]*[.])[0-9]+');
register('latitude', {
  description: 'latitude is a string in the format of a number',
  type: 'string',
  pattern: patterns.numericString,
});

register('longitude', {
  description: 'longitude is a string in the format of a number',
  type: 'string',
  pattern: patterns.numericString,
});

register('altitude', {
  description: 'altitude is a string in the format of a number',
  type: 'number',
  pattern: patterns.numericString,
});
register('lat', override('latitude', {
  description: 'lat is shorthand for latitude'
}));
register('lon', override('latitude', {
  description: 'lon is shorthand for longitude'
}));
register('alt', override('altitude', {
  description: 'alt is shorthand for altitude'
}));

register('datum', {
  description: 'datum describes the model of the earth used for GPS coordinates.  It can be from a '+
               'set of known strings, or an EPSG model from http://spatialreference.org',
  anyOf: [
    // set of known strings
    enumSchema(['WGS84']), // only WGS84 is known currently
    // EPSG object (http://spatialreference.org/ref/epsg/wgs-84/json/)
    {
      required: ['type', 'properties'], 
      properties: {
        // two valid keys in epsg object as 'properties' and 'type'.  Confusing, I know.
        type: requireValue('EPSG'),
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
    properties: vocabToProperties([
      'datum', 'latitude', 'longitude', 'altitude', 'lat', 'lon', 'alt', 'geohash' 
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
    properties: vocabToProperties([
      'units', 'value', 'sum', 'count', 'sum-of-squares'
    ]),
});

register('moisture', override('generic-data-value', {
    description: 'moisture is a data type which holds a reading of the amount of moisture in a crop. '+
           'It is typically in units of % water (%H2O).',
    properties: {
      // override the default 'units' with these known moisture units:
      'units': enumSchema([ '%H2O' ]),
    },
}));

register('weight', override('generic-data-value', {
    description: 'weight is a data type which holds a reading of weight, as in bushels, lbs, or kg.',
    properties: {
      'units': enumSchema([ 'bu', 'bushels', 'lbs', 'kg' ]),
    },
}));

register('area', override('generic-data-value', {
    description: 'area is a data type which holds a reading of...area...',
    properties: {
      'units': enumSchema([ 'ac', 'acres', 'ha', 'hectares', 'sqft' ] )
    },
}));

register('width', override('generic-data-value', {
  description: 'width is a data type which holds readings of swath width, or other widths of things.',
  properties: {
    'units': enumSchema([ 'ft', 'feet', 'm', 'meters' ]),
  },
}));

register('time', override('generic-data-value', {

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
    properties: vocabToProperties([ 
      'id', 'location', 'template', 'datum', 'moisture', 'weight',
      'area', 'time', 'crop-type',
    ]),
});

register('stats', override('data-point', {
    description: 'stats sits at the top of a resource to list stats about the data inside that resource. '+
           'Basic stats are sum, count, sum-of-squares.  The actual keys under stats are data names '+
           'that you have stats for like weight, area, etc.  The same units and data names are valid '+
           'under stats that are valid under data',
}));

register('data', {
    description: 'data is a general key for holding a collection of data points indexed by '+
           'random strings.',
    patternProperties: {
      [patterns.indexSafePropertyNames]: vocab('data-point'),
    }
});

register('templates', override('data', {
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
    patternProperties: {
      // this means that the properties on a geohash-data object will look like
      // geohashes, and their values will look like data-point's
      [patterns.geohash]: vocab('data-point'),
    }
});

register('sensor', {
  description: 'A link to a sensor document',
  properties: link('application/vnd.oada.sensor.1+json'),
});

register('sensors', {
  description: 'sensors is a generic list of links to sensors, keyed by a unique string',
  patternProperties: {
    [patterns.indexSafePropertyNames]: vocab('sensor'),
  }
});

register('serial-numbers', {
  description: 'serial-numbers is an object whose keys represent serial numbers of '+
               'something (i.e. a sensor hub), and each key just links to that thing',
  patternProperties: {
    [patterns.indexSafePropertyNames]: link(),
  }
});

//-----------------------------------------------------------------------

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// Indexes: documents that help partition a large document into smaller ones
//---------------------------------------------------------------------------

libvocab.setPattern('year', '^[0-9]{4}$');
register('year-index', {
  description: 'year-index splits things up by a 4-digit year',
  patternProperties: {
    [patterns.year]: vocab('link'),
  },
  // This is a specially-added key for oada-schema: since this is an index,
  // it's keys will also become values in the indexing array that tracks
  // which indexes have been applied at a given level, so we need a schema 
  // to match those values as well.  It should agree with the matching of the
  // properties above.
  indexingSchema: { 
    properties: {
      index: requireValue('year-index'),
      source: requireValue('oada.vocab.year-index'),
      value: { type: 'string', pattern: patterns.year },
    }
  },
});

// crop-index is one of those keys that embeds it's content right inside the document itself
// instead of linking to another document which contains all the crop types.  Each of the
// crop-type's are possible keys, and their values are links to resources
register('crop-index', {
  description: 'crop-index is an object that sits inside other objects and gives links to '+
               'documents based on the name of a particular crop. It\'s known keys are '+
               'also not considered part of the OADA vocabulary and therefore do '+
               'not appear as vocabulary terms even though they will be in OADA URLs.  This '+
               'is standard for indexes.',
  // This will look like;
  //   corn: { link },
  //   beans: { link },
  //   wheat: { link },
  properties: copySchemaToKeys({ 
    keys: vocab('crop-type').known, 
    schema: vocab('link')
  }),
  indexingSchema: { 
    properties: {
      index: requireValue('crop-index'),
      value: enumSchema(vocab('crop-type').known),
      source: enumSchema(['oada.vocab.crop-type']),
    },
  },
});

libvocab.setPattern('geohashLengthIndex', '^geohash-[1-9][0-9]*$');
register('geohash-length-index', {
  description: 'geohash-length-index is an indexing scheme that groups data by geohash string lengths. '+
               'As with all indexes, it is not a document type itself and therefore cannot be '+
               'linked to.  It can also have a "datum" key which tells the earth model used for GPS.',
  // all geohash-length-index keys are geohash string lengths: geohash-1, geohash-2, etc.
  properties: vocabToProperties(['datum']), // this one is not a link
  patternProperties: {
    [patterns.geohashLengthIndex]: vocab('link'),
  },
  indexingSchema: {
    properties: {
      index: requireValue('geohash-length-index'),
      value: { type: 'string', pattern: patterns.geohashLengthIndex },
      source: enumSchema(['oada.vocab.geohash-length-index']),
    },
  },
});


register('geohash-index', {
  description: 'geohash-index is a key that holds under it a set of geohash keys of a particular '+
         'length.  It is necessary because some geohashes may be legitimate words and '+
         'therefore we need to place all the geohashes specifically under one key. '+
         'This key usually sits at the top-level of a document reached via a geohash-length-index. '+
         'It is intended to hold links to resources containing data that is grouped under '+
         'a particular geohash.',
  // geohashes are 1-n length character strings using 0-9 or subset of letters (base32)
  patternProperties: {
    [patterns.geohash]: vocab('link'),
  },
  indexingSchema: {
    properties: {
      index: requireValue('geohash-index'),
      value: vocab('geohash'),
      source: enumSchema(['oada.vocab.geohash']),
    },
  },
});

// 2019-05-07
libvocab.setPattern('day', '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
register('day-index', {
  description: 'day-index splits things up by days, with full year-month-day string for keys',
  patternProperties: {
    [patterns.day]: vocab('link'),
  },
  indexingSchema: { 
    properties: {
      index: requireValue('day-index'),
      source: requireValue('oada.vocab.day-index'),
      value: { type: 'string', pattern: patterns.day },
    }
  },
});

// 23:44
libvocab.setPattern('hour', '^[0-9]{2}:[0-9]{2}$');
register('hour-index', {
  description: 'hour-index splits things up by hours, 24-hour time string in GMT like 06:07 or 23:44',
  patternProperties: {
    [patterns.hour]: vocab('link'),
  },
  indexingSchema: { 
    properties: {
      index: requireValue('hour-index'),
      source: requireValue('oada.vocab.hour-index'),
      value: { type: 'string', pattern: patterns.hour },
    }
  },
});


//------------------------------------------------------------------------
// End of known terms, here are helpful functions used above:
//------------------------------------------------------------------------

module.exports = libvocab;
