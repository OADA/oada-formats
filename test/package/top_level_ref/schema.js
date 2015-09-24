module.exports = {
    id: 'oada-foramts://top_level_ref',
    description: 'top_level_ref',
    required: [
        'b'
    ],
    additionalProperties: false,
    properties: {
        b: {$ref: 'oada-formats://top_level'},
    }
};
