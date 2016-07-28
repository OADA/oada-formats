'use strict';
var ValidationError =
    require('../../../../../../../../model.js').ValidationError;

module.exports = {
    additionalValidators: [
        function(d) {

            var errorKey = Object.keys(d['data']).reduce(function(value, key) {
                var soilTemp = d.data[key] && d.data[key]['soil-temperature'];
                var template = d.data[key] && d.data[key].template;
                var soilTempTemplate = d.templates &&
                    d.templates[template]['soil-temperature'];

                if (soilTemp  && !soilTempTemplate) {
                    value = template;
                }
                return value;
            }, '');

            if (errorKey !== '') {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.templates.' + errorKey,
                    message: 'Template needs soil-temperature is used in data'
                });
            } else {
                return true;
            }
        }
    ]
};
