var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_WIND_DIRECTION_ID,
    description: 'application/vnd.oada.sensor-data.wind-direction.1+json',

    additionalProperties: true,

    allOf: [{
        $ref: refs.OADA_SENSOR_DATA_GENERIC_ID
    },
    {
        properties: {
            dataType: {
                properties: {
                    definition: {
                        pattern: '^https\\:\\/\\/github.com/oada-formats/' +
                                 'tree/master/formats/application/vnd/oada/' +
                                 'sensor-data/wind-direction/1/\\+json$',
                    },
                    name: {
                        pattern: '^wind-direction$'
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
            }
        }
    }]
};
