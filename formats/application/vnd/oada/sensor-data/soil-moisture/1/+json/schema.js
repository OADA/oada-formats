var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_SOIL_MOISTURE_ID,
    description: 'application/vnd.oada.sensor-data.soil-moisture.1+json',

    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_SENSOR_DATA_GENERIC_ID
    },
    {
        properties: {
            dataType: {
                properties: {
                    definition: {
                        pattern: '^https\\:\\/\\/github.com/oada-formats'
                    },
                    name: {
                        pattern: '^soil-moisture$'
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
                            },
                            temperature: {
                                properties: {
                                    units: {
                                        type: 'string'
                                    }
                                }
                            },
                            'moisture-type': {
                                type: 'string'
                            },
                            'soil-temperature': {
                                properties: {
                                    units: {
                                        type: 'string'
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
                            },
                            'soil-temperature': {
                                properties: {
                                    value: {
                                        type: 'number'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }]
};
