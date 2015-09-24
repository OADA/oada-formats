'use strict';

module.exports = {
    additionalValidators: [
        function(d) {
            var cassert = d['client_assertion_signing_alg_values_supported'];

            if (cassert && cassert.indexOf && cassert.indexOf('RS256') === -1) {
                return false;
            } else {
                return true;
            }
        }
    ]
};
