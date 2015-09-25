var types = require('../../../../../../types.js');

module.exports = {
    id: types.OADA_IRRIGATION_ID,
    description: 'application/vnd.oada.irrigation.1+json',

    // You can add any custom keys to irrigation that you want
    additionalProperties: true,

    // Here are the standard-defined keys:
    properties: {
        machines: {
            $ref: types.OADA_LINK_VERSIONED,
        },
    },
};
