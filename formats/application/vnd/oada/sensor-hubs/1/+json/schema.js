var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_HUBS_ID,
    description: 'application/vnd.oada.sensor-hubs.1+json',

    additionalProperties: true,

    properties: {
        'serial-numbers': {
            $ref: refs.OADA_LINK_VERSIONED_LIST
        }
    },
    required: [
        'serial-numbers'
    ]
};
