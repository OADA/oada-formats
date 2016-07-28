var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_DATA_INDEX_ID,
    description: 'application/vnd.oada.data-index.1+json',

    // You can add any custom keys to bookmarks that you want
    additionalProperties: true,

    // Here are the standard-defined keys:
    properties: {

        // timehash-*
        'timehash-1': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{1}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-2': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{2}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-3': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{3}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-4': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{4}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-5': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{5}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-6': {
            additionalProperties: false,
            patternProperties: {
                "^\d+0{6}$": {
                    $ref: refs.OADA_LINK,
                }
            }
        },
        'timehash-7': {
            type: 'object',
            patternProperties: {
                "^[0-9]+0{7}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'timehash-8': {
            type: 'object',
            patternProperties: {
                "^[0-9]+0{8}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'timehash-9': {
            type: 'object',
            patternProperties: {
                "^[0-9]+0{9}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },

        // geohash-*
        'geohash-1': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{1}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-2': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{2}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-3': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{3}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-4': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{4}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-5': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{5}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-6': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{6}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-7': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{7}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-8': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{8}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-9': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{9}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-10': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{10}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-11': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{11}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },
        'geohash-12': {
            type: 'object',
            patternProperties: {
                "^[0-9bcdefghjkmnpqrstuvwxyz]{12}$": {
                    $ref: refs.OADA_LINK,
                }
            },
            additionalProperties: false
        },

        list: {
            $ref: refs.OADA_LINK_LIST
        }
    }
};
