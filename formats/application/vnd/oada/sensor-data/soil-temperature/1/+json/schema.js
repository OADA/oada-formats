var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_SOIL_TEMPERATURE_ID,
    description: 'application/vnd.oada.sensor-data.soil-temperature.1+json',

    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_SENSOR_DATA_GENERIC_ID
    },
    {
        properties: {
            dataType: {
                properties: {
                    definition: {
                        pattern: '^https\\:\\/\\/github.com/oada-formats',
                    },
                    name: {
                        pattern: '^soil-temperature$'
                    }
                }
            },
            templates: {
                patternProperties: {
                    '.': {
                        properties: {
                            units: {
                                type: 'string',
                            },
                            depth: {
                                properties: {
                                    units: {
                                        type: 'string'
                                    },
                                    value: {
                                        type: 'number'
                                    }
                                }
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
                                type: 'number'
                            }
                        }
                    }
                }
            }
        }
    }]
};
