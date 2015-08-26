// Response to POST /register in oauth-dyn-reg

var _RegisterResponse = function(version) {
  // There is only one version for now
  return {
    example: function() {
      return {
        "client_id": "3klaxu838akahf38acucaix73",
        "client_id_issued_at": 1418423102,
        "software_version": "1.0-ga",
        "scopes": "read:planting.prescriptions write:fields",
        "redirect_uris": [
          "https://client.example.com/callback",
          "https://client.example.com/cb"
        ],
        "token_endpoint_auth_method": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "grant_types": [
          "implicit", 
          "authorization_code",
          "refresh_token"
        ],
        "response_types": [
          "token",
          "code" 
        ],
        "client_name": "Example OADA Client",
        "client_uri": "http://example.com",
        "logo_uri": "http://example.com/logo.png",
        "contacts": [
          "Clint Client <cclient@example.com>"
        ],
        "tos_uri": "http://example.com/tos.html",
        "policy_uri": "http://example.com/policy.html",
        "software_id": "djxkjau3n937xz7jakl3",
        "registration_provider": "registration.example.com"
      };
    },

// STOPPED HERE: pass it through the schema validator
// maybe start with well-known doc instead of this one?
    validate: function() {
      throw new Error("validate: not implemented");

      // Don't forget to check that 
    },
  };

};

module.exports = _Bookmarks;
