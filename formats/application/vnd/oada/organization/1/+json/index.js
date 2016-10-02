'use strict';

var cloneDeep = require('lodash.clonedeep');
var SchemaOrgValidator = require('schema.org-validator');
var ValidationError = require('../../../../../../../model.js').ValidationError;

var sov = new SchemaOrgValidator({schemas: ['Organization']});

module.exports = {
    additionalValidators: [
        function(d) {
            var obj = cloneDeep(d);
            delete obj.bookmarks;
            delete obj.contactPerson;
            delete obj._id;
            delete obj._meta;
            delete obj._type;
            delete obj._rev;

            var result = sov.validate(obj, 'Organization');
            if (result.length) {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.',
                    message: 'Must be a valid Schema.org Organization. Result = ' + JSON.stringify(result, false, '  '),
                });
            } else {
                return true;
            }
        }
    ]
};
