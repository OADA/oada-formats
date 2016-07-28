var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_PERSON_ID,
    description: 'application/vnd.oada.person.1+json',

    additionalProperties: true,

    properties: {
        memberOf: {
            anyOf: [{
                $ref: refs.OAD_LINK_NON_VERSIONED
            },
            {
                $ref: refs.OADA_ORGANIZATION_ID
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
    }
};
