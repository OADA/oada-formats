var types = require('../../../../../../../types.js');

module.exports = {
    id: types.OADA_DYN_REG_RESPONSE_ID,
    description: 'application/vnd.oada.oauth-dny-reg.register-response.1+json',

    required: [
        'client_id',
        'client_id_issued_at',
        'scopes',
        'redirect_uris',
        'token_endpoint_auth_method',
        'grant_types',
        'response_types',
        'tos_uri',
        'policy_uri',
        'software_id',
    ],

    // You can add any custom keys to oada-configuration that you want
    additionalProperties: true,

    // Here are the standard-defined properties:
    properties: {
        'client_id': {
            type: 'string',
        },
        'client_id_issued_at': {
            type: 'number',
        },
        scopes: {
            type: 'string',
        },
        'redirect_uris': {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
                pattern: '^https://.*'
            },
        },
        'token_endpoint_auth_method': {
            type: 'string',
        },
        'grant_types': {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string'
            }
        },
        'response_types': {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'string',
            }
        },
        'tos_uri': {
            type: 'string',
            format: 'uri'
        },
        'policy_uri': {
            type: 'string',
            format: 'uri'
        },
        'software_id': {
            type: 'string'
        }
    },
};
