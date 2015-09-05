module.exports = {
  id: "/oada/user.1",
  description: "application/vnd.oada.user.1+json",

  // None of the keys in bookmarks are required to be there.
  required: [ ],

  // You can add any custom keys to users that you want
  additionalProperties: true,

  // Here are the standard-defined keys:
  properties: {
     bookmarks: { $ref: '/oada/lib/link.1#definitions/versioned', },
  },

};
