// This file contains JSONSchema in it.  To convert from Javascript
// to actual JSON.parse-able JSON, contact Aaron to write a script
// to JSON.stringify the schema, or just JSON.stringify the schema.
// You might also want to transform the id's to fit your domain.

// Irrigation.Machines:
module.exports = {
  id: "/oada/irrigation/machines.1",
  description: "application/vnd.oada.irrigation.machines.1+json",

  // Has to implement name and list
  required: [ 'name', 'list' ], 

  // You can add any custom keys to that you want
  additionalProperties: true,

  // Here are the standard-defined keys:
  properties: {
    name: { type: 'string', pattern: 'irrigation' },
    list: { $ref: '/oada/link.1#/definitions/list/versioned' },
  },

};
