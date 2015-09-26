#!/usr/bin/env node

var fs = require('fs');
var os = require('os');
var Promise = require('bluebird');
var markdownToc = require('markdown-toc');
var Formats = require('../formats.js');

function generateDocs(mediatypes, filename) {
    var formats = new Formats();
    var docs = '';

    return Promise
        .resolve(mediatypes)
        .each(function(mediatype) {
            docs += '# ' + mediatype + os.EOL + os.EOL;

            return formats
                .model(mediatype)
                .tap(function(model) {
                   docs += '## Schema' + os.EOL;
                   docs += '```json' + os.EOL;

                   return model
                       .schema()
                       .then(function(schema) {
                            docs += JSON.stringify(schema, null, 2) + os.EOL;
                            docs += '```' + os.EOL + os.EOL;
                       });
                })
                .tap(function(model) {
                   docs += '## Example' + os.EOL;
                   docs += '```json' + os.EOL;

                   return model
                       .example('default')
                       .then(function(example) {
                            docs += JSON.stringify(example, null, 2) + os.EOL;
                            docs += '```' + os.EOL + os.EOL;
                       });
                });
        })
        .then(function() {
           var contents = markdownToc(docs).content;
           contents = contents.replace(/application-/, 'user-content-application');
           contents = contents.replace(/-json/, 'json');

           docs = '# Contents' + os.EOL + os.EOL + contents + os.EOL + os.EOL
               + docs;

           fs.writeFileSync(filename, docs);
        })
        .then(function() {
            console.log('Docs written to ' + filename);
        })
        .catch(function(e) {
            console.log('Doc generation failed');
            console.log(e);
        });
}
module.exports = generateDocs;

if(require.main === module)  {
    var formats = new Formats();

    generateDocs(Object.keys(formats.mediatypes), './test.md');
}
