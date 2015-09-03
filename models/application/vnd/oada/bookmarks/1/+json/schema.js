module.exports = {
  id: "/oada/bookmarks.1",
  description: "application/vnd.oada.bookmarks.1+json",

  // None of the keys in bookmarks are required to be there.
  required: [ ],

  // You can add any custom keys to bookmarks that you want
  additionalProperties: true,

  // Here are the standard-defined keys:
  properties: {
      planting: { $ref: '/oada/lib/link.1#definitions/versioned', },
       harvest: { $ref: '/oada/lib/link.1#definitions/versioned', },
      machines: { $ref: '/oada/lib/link.1#definitions/versioned', },
    irrigation: { $ref: '/oada/lib/link.1#definitions/versioned', },
       sensors: { $ref: '/oada/lib/link.1#definitions/versioned', },
        fields: { $ref: '/oada/lib/link.1#definitions/versioned', },
         sales: { $ref: '/oada/lib/link.1#definitions/versioned', },
       clients: { $ref: '/oada/lib/link.1#definitions/versioned', },
  },

};
