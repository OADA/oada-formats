var refs = require('../../../../../../refs.js');

// Links: both a versioned link and a non-versioned link are
// valid 'links'.  Use the particular ones (versioned-link, nonversioned-link)
// if you want to explicitly make sure it's one or the other.
module.exports = {
    id: refs.OADA_LINK_ID,
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
            additionalProperties: false,
            properties: {
                _id: {
                    type: 'string'
                },
            },
            required: [
                '_id'
            ],
        },

        versioned: {
            type: 'object',
            additionalProperties: false,
            properties: {
                _id: {
                    type: 'string'
                },
                _rev: {
                    type: 'string',
                    pattern: '^[0-9]+-.+'
                }
            },
            required: [
                '_id',
                '_rev'
            ],
        },

        list: {
            type: 'object',
            patternProperties: {
                '.': {
                    $ref: '#/definitions/link'
                }
            },
        },

        versionedList: {
            type: 'object',
            patternProperties: {
                '.': {
                    $ref: '#/definitions/versioned'
                }
            }
        }
    },
};
