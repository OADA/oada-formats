// This file contains JSONSchema in it.  To convert from Javascript
// to actual JSON.parse-able JSON, contact Aaron to write a script
// to JSON.stringify the schema, or just JSON.stringify the schema.
// You might also want to transform the id's to fit your domain.

// Links: both a versioned link and a non-versioned link are
// valid 'links'.  Use the particular ones (versioned-link, nonversioned-link)
// if you want to explicitly make sure it's one or the other.
module.exports = {
  id: "/oada/lib/link.1",
  description: "OADA Link object",

  definitions: {

    /////////////////////////////////////////////////////////////
    // Links:
    link: {
      anyOf: [
        { $ref: '#/definitions/nonversioned' },
        { $ref: '#/definitions/versioned' },
      ],
    },

    nonversioned: {
      type: 'object',
      required: [ '_id' ],
      additionalProperties: true,
      properties: {
        _id: { type: 'string' },
      },
    },

    versioned: {
      type: 'object',
      required: [ '_rev', '_id' ],
      additionalProperties: true,
      properties: {
        _id: { type: 'string' },
        _rev: { type: 'string', pattern: '^[0-9]+-.+', }
      },
    },


    ////////////////////////////////////////////////////////////
    // Lists of links:
    // { 
    //   'kdfj02ilksf': { _id: 'idfu02jk', '1-kdfj902ief' },
    //   '0d2ijlfdsls': { _id: 'kd0f2jik", '2-0dfkjl29if' },
    // }
    list: {
      versioned: {
        type: 'object',
        additionalProperties: {
          $ref: '#/definitions/versioned'
        },
      },

      nonversioned: {
        type: 'object',
        additionalProperties: {
          $ref: '#/definitions/nonversioned'
        },
      },

      list: {
        type: 'object',
        additionalProperties: {
          $ref: '#/definitions/link'
        },
      },
    },

  },

};
