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

var path = require('path');
var glob = require('glob');

module.exports = function(context) {

    // Search for all paths from directory structure
    var paths = glob
        .sync('index.js', {
            cwd: __dirname,
            matchBase: true,
        })
        .filter(function(p) {
            return p !== 'index.js';
        })
        .map(function(p) {
            return p.replace('/index.js', '');
        });

    // Build mediatype map from that
    var types = {};
    paths.forEach(function(p) {
        var type = p
            .replace(/\//g, '.')
            .replace('.', '/')
            .replace(/[\.\/]\+([^+]*$)/, '+$1');

        types[type] = path.join(__dirname, p);
    });

    // Add mediatype map to oada-formats
    context._addMediatypes(types);
};
