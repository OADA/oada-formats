module.exports = {
  id: "/valleyix/machine.1",
  description: "application/vnd.valleyix.machine.1+json",
  required: [ ],
  additionalProperties: true,
  properties: {
       configuration: { $ref: '/oada/lib/link/#definitions/versioned-link' },
              status: { $ref: '/oada/lib/link/#definitions/versioned-link' },
             applied: { $ref: '/oada/lib/link/#definitions/versioned-link' },
            vriZones: { $ref: '/oada/lib/link/#definitions/versioned-link' },
    vriPrescriptions: { $ref: '/oada/lib/link/#definitions/versioned-link' },
          workOrders: { $ref: '/oada/lib/link/#definitions/versioned-link' },
  },
};
