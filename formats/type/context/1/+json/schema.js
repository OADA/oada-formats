var refs = require('../../../../refs.js');

module.exports = {
    id: refs.TYPE_CONTEXT_ID,
    descriptions: 'Default OADA context duck-type',

    additionalProperties: true,

    type: 'object',
    properties: {
        client: {
            $ref: refs.OADA_LINK
        },
        'sensor-hub': {
            $ref: refs.OADA_LINK
        }
    },
    patternProperties: {
        'timehash-[1-9]+': {
            type: 'number'
        }
    }
};
