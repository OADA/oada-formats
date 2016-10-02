// This test just tries to include all the JS files under the formats/ directory 
// and the lib/ directory to make sure they all actually compile.  Handy while 
// developing a set of schemas.

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var FindFiles = require('node-find-files');
var _ = require('lodash');
var path = require('path');


// Here's a handy function used below that will find all Javascript files
// under a root folder and return an array of them to you as a promise
// that is fulfilled when the entire path is traversed.
function findJSFiles(root_path) {
  return new Promise(function(resolve, reject) {
    var js_files = [];
    var formats_finder = new FindFiles({
      rootFolder: root_path,
      filterFunction: function(path, stat) {
        return path.match(/\.js$/, path) && stat.isFile();
      },
    });
    formats_finder.on('match', function(path, stat) {
      js_files.push(path);
    });
    formats_finder.on('patherror', function(err, path) {
      reject('Failed on path ' + path + ' with err = ', err);
    });
    formats_finder.on('complete', function() {
      resolve(js_files);
    });
    formats_finder.startSearch();
  });
};

describe('compilation', function() {

  before(function() {
    return Promise.all([
      findJSFiles(__dirname + '/../formats'),
      findJSFiles(__dirname + '/../lib'),
    ]).then(function(files) {
      return _.union(files[0], files[1]);
    }).then(function(files) {
      describe('all JS files should compile under node', function() {
        _.each(files, function(f) {
          var readable = f.replace(path.normalize(__dirname+'/../'),'');
          it('node ' + readable, function() {
            return expect(Promise.try(function() {
              require(f);
            }).catch(function(e) {
              throw new Error(e.stack);
            })).to.eventually.be.fulfilled;
          });
        });
      });
    });
  });

  it('should write the compilation tests after reading all the Javascript filenames', function() {});
});
