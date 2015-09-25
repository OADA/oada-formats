module.exports = {
    'well_known_version': '1.0.0',
    'oada_base_uri': 'https://oada.example.com',
    'authorization_endpoint': 'https://oada.example.com/auth',
    'token_endpoint': 'https://oada.example.com/token',
    'registration_endpoint': 'https://oada.example.com/register',
    'client_assertion_signing_alg_values_supported': [
        'RS256'
    ],
    'scopes_supported': [{
        name: 'oada.all.1',
        'read+write': true
    }],
};
