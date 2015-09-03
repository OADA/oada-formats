module.exports = {
  id: "/oada/irrigation.1",
  description: "application/vnd.oada.irrigation.1+json",

  // None of the keys in irrigation are required to be there.
  required: [ ],

  // You can add any custom keys to irrigation that you want
  additionalProperties: true,

  // Here are the standard-defined keys:
  properties: {
    machines: { $ref: '/oada/lib/link.1#definitions/versioned', },
  },
};
