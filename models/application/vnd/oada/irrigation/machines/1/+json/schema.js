var refs = require('../../../../../../../refs.js');

// Irrigation.Machines:
module.exports = {
    id: refs.OADA_IRRIGATION_MACHINES_ID,
    description: 'application/vnd.oada.irrigation.machines.1+json',

    // Has to implement name and list
    required: [
        'name',
        'list'
    ],

    // You can add any custom keys to that you want
    additionalProperties: true,

    // Here are the standard-defined keys:
    properties: {
        name: {
            type: 'string',
            pattern: 'irrigation'
        },
        list: {
            $ref: refs.OADA_LINK_LIST
        },
    },
};
