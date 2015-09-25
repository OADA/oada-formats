var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_CLIENTS_ID,
    description: 'application/vnd.oada.clients.1+json',
    additionalProperties: true,
    required: [
        'name',
        'list'
    ],
    properties: {
        name: {
            type: 'string',
            pattern: 'clients'
        },
        list: {
            $ref: refs.OADA_LINK_LIST,
        }
    }
};
