var refs = require('../../../../refs.js');

module.exports = {
    id: refs.TYPE_LOCATION_ID,
    descriptions: 'Default OADA location duck-type',

    additionalProperties: true,

    anyOf: [{
        $ref: refs.OADA_LINK
    },
    {
        $ref: refs.OADA_SENSOR_DATA_LOCATION_ID
    },
    {
        type: 'object',
        properties: {
            latitude: {
                type: 'number',
                minimum: -90,
                maximum: 90
            },
            longitude: {
                type: 'number',
                minimum: -180,
                maximum: 180
            },
            altitude: {
                type: 'number'
            }
        },
        required: [
            'latitude',
            'longitude'
        ]
    },
    {
        type: 'object',
        properties: {
            geojson: {
                type: 'object'
            }
        },
        required: [
            'geojson'
        ]
    }]
};
