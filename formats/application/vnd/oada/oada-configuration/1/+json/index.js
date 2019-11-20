module.exports = {
  additionalValidators: [
    function(d) {
      var cassert = d['token_endpoint_auth_signing_alg_values_supported'];

      if (cassert && cassert.indexOf && cassert.indexOf('RS256') === -1) {
        throw new Error('token_endpoint_auth_signing_alg_values_supported should have "RS256" as an element');
      }
      return true;
    }
  ]
};
