var cloneDeep = require('lodash.clonedeep');
var SchemaOrgValidator = require('schema.org-validator')
var ValidationError = require('../../../../../../../model.js').ValidationError;

var sov = new SchemaOrgValidator({schemas: ['Organization']});

module.exports = {
    additionalValidators: [
        function(d) {
            var obj = cloneDeep(d);
            delete obj.bookmarks;
            delete obj.contactPerson;

            if (sov.validate(obj, 'Organization').length) {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.',
                    message: 'Must be a valid Schema.org Organization'
                });
            } else {
                return true;
            }
        }
    ]
}
