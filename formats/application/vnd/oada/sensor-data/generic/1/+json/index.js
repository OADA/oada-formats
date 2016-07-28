'use strict';
var ValidationError =
    require('../../../../../../../../model.js').ValidationError;

module.exports = {
    additionalValidators: [
        function(d) {
            var errorKey = Object.keys(d['data']).reduce(function(value, key) {
                var timeStart = d['data'][key]['time-start'];
                var timeEnd = d['data'][key]['time-end'];

                if (timeStart && timeEnd) {
                    value = timeStart < timeEnd ? value : key;
                }
                return value;
            }, '');

            if (errorKey !== '') {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.data.' + errorKey,
                    message: 'should: time-start < time-end'
                });
            } else {
                return true;
            }
        }
    ]
};
