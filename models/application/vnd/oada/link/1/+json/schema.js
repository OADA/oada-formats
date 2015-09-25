var types = require('../../../../../../types.js');

// Links: both a versioned link and a non-versioned link are
// valid 'links'.  Use the particular ones (versioned-link, nonversioned-link)
// if you want to explicitly make sure it's one or the other.
module.exports = {
    id: types.OADA_LINK_ID,
    description: 'OADA Link object',

    definitions: {
        link: {
            anyOf: [{
                $ref: '#/definitions/nonversioned'
            },
            {
                $ref: '#/definitions/versioned'
            }],
        },

        nonversioned: {
            type: 'object',
            required: [
                '_id'
            ],
            additionalProperties: true,
            properties: {
                _id: {
                    type: 'string'
                },
            },
        },

        versioned: {
            type: 'object',
            required: ['_rev', '_id'],
            additionalProperties: true,
            properties: {
                _id: {
                    type: 'string'
                },
                _rev: {
                    type: 'string',
                    pattern: '^[0-9]+-.+'
                }
            },
        },

        list: {
            versioned: {
                type: 'object',
                additionalProperties: {
                    $ref: '#/definitions/versioned'
                },
            },

            nonversioned: {
                type: 'object',
                additionalProperties: {
                    $ref: '#/definitions/nonversioned'
                },
            },

            list: {
                type: 'object',
                additionalProperties: {
                    $ref: '#/definitions/link'
                },
            },
        },

    },
};
