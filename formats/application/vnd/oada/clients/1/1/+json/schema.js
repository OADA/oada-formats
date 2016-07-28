var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_CLIENTS_1_1_ID,
    description: 'application/vnd.oada.clients.1.1+json',
    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_DATA_INDEX_ID
    },
    {
        required: [
            'list'
        ]
    }]
};
