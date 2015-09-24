module.exports = {
    id: 'oada-formats://test/broken_ref',
    description: 'test/broken_ref',
    required: [
        'b'
    ],
    additionalProperties: false,
    properties: {
        b: {$ref: 'oada-formats://test/_does_not_exist_'}
    },
};
