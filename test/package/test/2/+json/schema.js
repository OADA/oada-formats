module.exports = {
    id: 'oada-formats://test/2+json',
    description: 'test/1',
    required: [
        'b'
    ],
    additionalProperties: false,
    properties: {
        b: {$ref: 'oada-formats://test/1'}
    },
};
