var refs = require('../../../../../../../refs.js');

module.exports = {
    id: refs.OADA_SENSOR_DATA_GENERIC_ID,
    description: 'application/vnd.oada.sensor-data.generic.1+json',

    additionalProperties: true,

    properties: {
        dataType: {
            type: 'object',
            properties: {
                definition: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                }
            },
            required: [
                'definition',
                'name'
            ]
        },
        context: {
            $ref: refs.TYPE_CONTEXT_ID
        },
        stats: {
            type: 'object',
            properties: {
                max: {
                    $ref: '#/definitions/statsData'
                },
                min: {
                    $ref: '#/definitions/statsData'
                },
                mean: {
                    $ref: '#/definitions/statsData'
                },
                std: {
                    $ref: '#/definitions/statsData'
                }
            }
        },
        templates: {
            type: 'object',
            patternProperties: {
                '.': {
                    type: 'object',
                    properties: {
                        sensor: {
                            anyOf: [{
                                $ref: refs.OADA_LINK
                            },
                            {
                                $ref: refs.OADA_SENSOR_ID
                            }]
                        },
                        units: {
                        },
                        location: {
                            $ref: refs.TYPE_LOCATION_ID
                        },
                        quantization: {
                            type: 'object',
                            properties: {
                                units: {
                                },
                                levels: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            start: {
                                                anyOf: [{
                                                    type: 'string'
                                                },
                                                {
                                                    type: 'number'
                                                }]
                                            },
                                            end: {
                                                anyOf: [{
                                                    type: 'string'
                                                },
                                                {
                                                    type: 'number'
                                                }]
                                            },
                                            value: {
                                                anyOf: [{
                                                    type: 'string'
                                                },
                                                {
                                                    type: 'number'
                                                }]
                                            },
                                        },
                                        required: [
                                            'value'
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    required: [
                        'sensor',
                        'units'
                    ]
                }
            }
        },
        data: {
            type: 'object',
            patternProperties: {
                ".": {
                    allOf: [{
                        type: 'object',
                        properties: {
                            template: {
                                type: 'string'
                            },
                        },
                        required: [
                            'template',
                        ]
                    },
                    {
                        anyOf: [{
                            type: 'object',
                            properties: {
                                time: {
                                    type: 'number',
                                    minimum: 0
                                },
                                value: {
                                }
                            },
                            required: [
                                'time',
                                'value'
                            ],
                        },
                        {
                            type: 'object',
                            properties: {
                                'time-start': {
                                    type: 'number',
                                    minimum: 0
                                },
                                'time-end': {
                                    type: 'number',
                                    minimum: 0
                                },
                                max: {
                                    type: 'number',
                                },
                                min: {
                                    type: 'number',
                                },
                                mean: {
                                    type: 'number',
                                },
                                std: {
                                    type: 'number',
                                }
                            },
                            required: [
                                'time-start',
                                'time-end'
                            ],
                        }]
                    }]
                }
            }
        }
    },
    required: [
        'dataType',
        'context',
        'templates',
        'data'
    ],
    definitions: {
        statsData: {
            oneOf: [{
                type: 'object',
                properties: {
                    dataKey: {
                        type: 'string'
                    }
                },
                required: [
                    'dataKey'
                ]
            },
            {
                type: 'object',
                properties: {
                    value: {
                        oneOf: [{
                            type: 'string'
                        },
                        {
                            type: 'number'
                        }]
                    }
                },
                required: [
                    'value'
                ]
            }]
        }
    }
};
