var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_RAINFALL_ID,
    description: 'application/vnd.oada.sensor-data.rainfall.1+json',

    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_SENSOR_DATA_GENERIC_ID
    },
    {
        properties: {
            dataType: {
                properties: {
                    definition: {
                        pattern: '^https\\:\\/\\/github.com/oada-formats/tree/master/formats/application/vnd/oada/sensor-data/rainfall/1/\\+json$',
                    },
                    name: {
                        pattern: '^rainfall$'
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
                            rate: {
                                properties: {
                                    units: {
                                        type: 'string'
                                    }
                                },
                                required: [
                                    'units'
                                ]
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
                            rate: {
                                properties: {
                                    max: {
                                        type: 'number'
                                    },
                                    mean: {
                                        type: 'number'
                                    },
                                    std: {
                                        type: 'number'
                                    }
                                }
                            },
                            freezing: {
                                type: 'boolean'
                            }
                        }
                    }
                }
            }
        }
    }]
}
