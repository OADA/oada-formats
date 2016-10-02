'use strict';

var cloneDeep = require('lodash.clonedeep');
var SchemaOrgValidator = require('schema.org-validator');
var ValidationError = require('../../../../../../../model.js').ValidationError;

var sov = new SchemaOrgValidator({schemas: ['Person']});

module.exports = {
    additionalValidators: [
        function(d) {
            var obj = cloneDeep(d);
            delete obj.memberOf;
            delete obj.bookmarks;
            delete obj._id;
            delete obj._rev;
            delete obj._type;
            delete obj._meta;

            var results = sov.validate(obj, 'Person');
            if (results.length) {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.',
                    message: 'Must be a valid Schema.org Person. Results = ' + JSON.stringify(results, false, '  '),
                });
            } else {
                return true;
            }
        }
    ]
};
