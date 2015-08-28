module.exports = function _OADAConfiguration(version) {
    return {
        example: function() {
            return {
                well_known_version: "1.0.0",
                oada_base_uri: "https://oada.example.com",
                authorization_endpoint: "https://oada.example.com/auth",
                token_endpoint: "https://oada.example.com/token",
                registration_endpoint: "https://oada.example.com/register",
                token_endpoint_auth_signing_alg_values_supported: [ "RS256" ],
                client_secret_alg_supported: [ "RS256" ]
                scopes_supported: [{
                    name: "oada.all.1",
                    read+write: true
                }]
            }
        },

        validate: function() {
            throw new Error("validate: not implemented");
        },
    }
};
