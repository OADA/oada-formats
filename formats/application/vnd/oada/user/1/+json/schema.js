var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_USER_ID,
    description: 'application/vnd.oada.user.1+json',
    additionalProperties: true,
    properties: {
        bookmarks: {
            $ref: refs.OADA_LINK_VERSIONED
        }
    }
};
