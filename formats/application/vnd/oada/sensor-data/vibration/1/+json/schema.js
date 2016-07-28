var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_VIBRATION_ID,
    description: 'application/vnd.oada.sensor-data.vibration.1+json',

    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_SENSOR_DATA_GENERIC_ID
    },
    {
        properties: {
            dataType: {
                properties: {
                    definition: {
                        pattern: '^https\\:\\/\\/github.com/oada-formats/tree/master/formats/application/vnd/oada/sensor-data/vibration/1/\\+json$',
                    },
                    name: {
                        pattern: '^vibration$'
                    }
                }
            },
            templates: {
                patternProperties: {
                    '.': {
                        properties: {
                            units: {
                                type: 'string',
                            }
                        }
                    }
                }
            },
            data: {
                patternProperties: {
                    '.': {
                        properties: {
                            value: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    }]
}
