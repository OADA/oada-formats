var refs = require('../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_ID,
    description: 'application/vnd.oada.sensor-data.sensor.1+json',

    additionalProperties: true,

    properties: {
        context: {
            $ref: refs.TYPE_CONTEXT_ID
        },
        name: {
            type: 'string'
        },
        sensorType: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                subType: {
                    type: 'string'
                }
            }
        },
        model: {
            type: 'string'
        },
        manufacturer: {
            type: 'string'
        },
        manufacturerId: {
            type: 'string'
        },
        installation: {
            type: 'object',
            properties: {
                time: {
                    type: 'number'
                },
                location: {
                    $ref: refs.TYPE_LOCATION_ID
                },
                depth: {
                    type: 'object',
                    properties: {
                        units: {
                            type: 'string'
                        },
                        value: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        installationHistory: {
            patternProperties: {
                '.': {
                    $ref: '#/properties/installation'
                }
            }
        },
        measurementProperties: {
            properties: {
                units: {
                    type: 'string'
                },
                resolution: {
                    type: 'number'
                },
                accuracy: {
                    type: 'number'
                }
            }
        },
        data: {
            properties: {
                'soil-moisture': {
                    anyOf: [{
                        $ref: refs.OADA_VERSIONED_LINK
                    },
                    {
                        $ref: refs.OADA_SENSOR_DATA_SOIL_MOISTURE_ID
                    }]
                }
            }
        }
    }
};
