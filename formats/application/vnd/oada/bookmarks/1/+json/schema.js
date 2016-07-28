var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_BOOKMARKS_ID,
    description: 'application/vnd.oada.bookmarks.1+json',

    // You can add any custom keys to bookmarks that you want
    additionalProperties: true,

    // Here are the standard-defined keys:
    properties: {
        planting: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        harvest: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        machines: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        irrigation: {
            anyOf: [{
                $ref: refs.OADA_LINK_VERSIONED
            },
            {
                $ref: refs.OADA_IRRIGATION_ID
            }]
        },
        sensors: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        fields: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        sales: {
            $ref: refs.OADA_LINK_VERSIONED,
        },
        clients: {
            anyOf: [{
                $ref: refs.OADA_LINK_VERSIONED
            },
            {
                $ref: refs.OADA_CLIENTS_1_1_ID
            }]
        },
        'sensor-hubs': {
            anyOf: [{
                $ref: refs.OADA_LINK_VERSIONED
            },
            {
                $ref: refs.OADA_SENSOR_HUBS_ID
            }]
        }
    },
};
