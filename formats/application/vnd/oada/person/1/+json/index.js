var cloneDeep = require('lodash.clonedeep');
var SchemaOrgValidator = require('schema.org-validator')
var ValidationError = require('../../../../../../../model.js').ValidationError;

var sov = new SchemaOrgValidator({schemas: ['Person']});

module.exports = {
    additionalValidators: [
        function(d) {
            var obj = cloneDeep(d);
            delete obj.memberOf;
            delete obj.bookmarks;

            if (sov.validate(obj, 'Person').length) {
                throw ValidationError.fromErrors({
                    keyword: 'require',
                    dataPath: '.',
                    message: 'Must be a valid Schema.org Person'
                });
            } else {
                return true;
            }
        }
    ]
}
