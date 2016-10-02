var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_LOCATION_ID,
    description: 'application/vnd.oada.sensor-data.location.1+json',

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
                        pattern: '^location$'
                    }
                }
            },
            templates: {
                patternProperties: {
                    '.': {
                        properties: {
                            units: {
                                type: 'object',
                                properties: {
                                    datum: {
                                        type: 'string'
                                    }
                                },
                                required: [
                                    'datum'
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
                                type: 'object'
                            }
                        }
                    }
                }
            }
        }
    }]
};
