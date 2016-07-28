'use strict';
var ValidationError =
    require('../../../../../../../../model.js').ValidationError;

module.exports = {
    additionalValidators: [
        function(d) {

            var errorKey = Object.keys(d['data']).reduce(function(value, key) {
                var rate = d.data[key] && d.data[key].rate;
                var template = d.data[key] && d.data[key].template;
                var rateTemplate = d.templates && d.templates[template].rate;

                if (rate && !rateTemplate) {
                    value = template;
                }
                return value;
            }, '');

            if (errorKey !== '') {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.templates.' + errorKey,
                    message: 'Template needs rate if used in data'
                });
            } else {
                return true;
            }
        }
    ]
};
