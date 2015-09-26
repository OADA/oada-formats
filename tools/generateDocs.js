#!/usr/bin/env node
/* Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var fs = require('fs');
var os = require('os');
var Promise = require('bluebird');
var markdownToc = require('markdown-toc');
var Formats = require('../formats.js');

function generateDocs(mediatypes, filename, formats) {
    formats = formats ? formats : new Formats();
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
            contents = contents.replace(/#application-/g,
                    '#user-content-application');
            contents = contents.replace(/-json\)/g, 'json)');

            docs = '# Contents' + os.EOL + os.EOL + contents + os.EOL + os.EOL +
               docs;

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

if (require.main === module)  {
    var formats = new Formats();

    generateDocs(Object.keys(formats.mediatypes), './docs.md');
}
