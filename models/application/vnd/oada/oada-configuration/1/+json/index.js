'use strict';

module.exports = {
    example: require('./example.js'),
    schema: require('./schema.js'),
    mixin: function() {

        var validate = this.validate;
        this.validate = function(d)  {
            return validate.call(this, arguments)
                .then(function(valid) {
                    if(!valid) {
                        return valid;
                    }

                    var a = d['client_assertion_signing_alg_values_supported'];
                    if(a.indexOf && a.indexOf('RS256') === -1) {
                        return false;
                    }

                    return true;
                });
        };
    }
};
