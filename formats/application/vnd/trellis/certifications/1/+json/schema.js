var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_HUBS_ID,
    description: 'application/vnd.trellis.certifications.1+json',

    additionalProperties: true,

    // Just a list of versioned links which link to certifications
    properties: {
        '*': {
            $ref: refs.OADA_LINK_VERSIONED_LIST
        }
    },
};
