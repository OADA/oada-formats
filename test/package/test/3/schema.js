module.exports = {
    id: 'oada-formats://test/3',
    description: 'test/3',
    required: [
        'c'
    ],
    additionalProperties: false,
    properties: {
        c: {$ref: 'oada-formats://test/2+json'}
    },
};
