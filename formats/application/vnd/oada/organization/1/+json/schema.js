var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_ORGANIZATION_ID,
    description: 'application/vnd.oada.organization.1+json',
    additionalProperties: true,
    properties: {
        name: {
            type: 'string',
            minLength: 1
        },
        contactPerson: {
            anyOf: [{
                $ref: refs.OADA_LINK_NON_VERSIONED
            },
            {
                $ref: refs.OADA_PERSON_LINK
            }]
        },
        bookmarks: {
            anyOf: [{
                $ref: refs.OADA_LINK
            },
            {
                $ref: refs.OADA_BOOKMARKS_ID
            }]
        }
    },
    require: [
        'name'
    ]
};
