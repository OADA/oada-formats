var types = require('../../../../../../types.js');

module.exports = {
    id: types.OADA_CLIENTS_ID,
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
            $ref: types.OADA_LINK_LIST,
        }
    }
};
