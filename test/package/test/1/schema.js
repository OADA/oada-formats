module.exports = {
    id: 'oada-formats://test/1',
    description: 'test/1',
    required: [
        'a'
    ],
    additionalProperties: false,
    properties: {
        a: {type: 'string', pattern: '^a.+$'}
    },
};
