module.exports = {
    id: 'oada-formats://top_level',
    description: 'top_level',
    required: [
        'a'
    ],
    additionalProperties: false,
    properties: {
        a: {type: 'string', pattern: '^a.+$'},
    }
};
