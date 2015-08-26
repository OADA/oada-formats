var _OADAConfiguration = {
  example: function() {
    return { 
      oada_base_uri: "https://oada.example.com",
      authorization_endpoint: "https://oada.example.com/authorize",
      token_endpoint: "https://oada.example.com/token",
      registration_endpoint: "https://oada.example.com/register",
      token_endpoint_auth_signing_alg_values_supported: [ "RS256" ],
    };
  },

  validate: function() {
    throw new Error("validate: not implemented");
  },

};

module.exports = new _OADAConfiguration();
