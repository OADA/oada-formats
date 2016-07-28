var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_HUB_ID,
    description: 'application/vnd.oada.sensor-data.sensor-hub.1+json',

    additionalProperties: true,

    properties: {
        name: {
            type: 'string'
        },
        context: {
            $ref: refs.TYPE_CONTEXT_ID
        },
        location: {
            $ref: refs.TYPE_LOCATION_ID
        },
        sensors: {
            type: 'object',
            patternProperties: {
                '.': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_ID
                    }]
                }
            }
        },
        data: {
            type: 'object',
            properties: {
                'air-temperature': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_AIR_TEMPERATURE_ID
                    }]
                },
                'soil-moisture': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_SOIL_MOISTURE_ID
                    }]
                },
                'barometric-pressure': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_BAROMETRIC_PRESSURE_ID
                    }]
                },
                'dew-point': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_DEW_POINT_ID
                    }]
                },
                'relative-humidity': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_RELATIVE_HUMIDITY_ID
                    }]
                },
                'wind-speed': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_WIND_SPEED_ID
                    }]
                },
                'wind-direction': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_WIND_DIRECTION_ID
                    }]
                },
                'cloud-cover': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_CLOUD_COVER_ID
                    }]
                },
                'solar-radiation': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_SOLAR_RADIATION_ID
                    }]
                }
            }
        }
    }
};
