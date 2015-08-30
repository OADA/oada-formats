var expect = require('chai').expect;
var Promise = require('bluebird');
var recursive = Promise.promisify(require('recursive-readdir'));
var minimatch = require('minimatch');
var _ = require('lodash');

var top_level_tests = [ './oada', './valleyix' ];

var paths_to_test = [];

describe('examples', function() {

  // Get the list of all example files to test:
  before(function() {
    return Promise.each(top_level_tests, function(dir) {

      // Recursively list all files under top-level directories
      return recursive(dir)

      // Filter that list for only the example.1.js files:
      .then(function(files) {
        return _.filter(files, function(f) {
          return f.match(/example.*\.js/);
        });

      // Add the remaining files onto the main array to test
      }).then(function(files) {
        paths_to_test = paths_to_test.concat(files);
      });
    });
  });

  // You have to wrap this in .each because the before() isn't finished by the
  // time we get to here due to the promise.
  it('.each', function() {
    _.each(paths_to_test, function(p) {
      describe('('+p+'):', function() {
        it('should return a valid function which returns an object', function() {
          var e = require.main.require(p);
          expect(e).to.not.equal(null);
          expect(e).to.be.a('function');
          expect(e()).to.be.an('object');
        });
      });
    });
  });

});
