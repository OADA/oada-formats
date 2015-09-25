var types = require('../../../../../../types.js');

module.exports = {
    id: types.OADA_BOOKMARKS_ID,
    description: 'application/vnd.oada.bookmarks.1+json',

    // You can add any custom keys to bookmarks that you want
    additionalProperties: true,

    // Here are the standard-defined keys:
    properties: {
        planting: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        harvest: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        machines: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        irrigation: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        sensors: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        fields: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        sales: {
            $ref: types.OADA_LINK_VERSIONED,
        },
        clients: {
            $ref: types.OADA_LINK_VERSIONED,
        },
    },
};
