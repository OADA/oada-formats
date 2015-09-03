'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var recursive = Promise.promisify(require('recursive-readdir'));
var _ = require('lodash');
var log = require('bunyan').createLogger({
  name: 'test/validate.js',
  level: 'fatal' // set this to 'debug' to see more info
});

var factory = require('../model.js')({
  libs: {
    log: function() { return log; }
  }
});

var top_level_tests = [ 'oada', 'valleyix' ];

var mediatypes_to_test = [];

describe('validate', function() {

  /////////////////////////////////////////////////////////////////////
  // Get the list of all mediatypes to test:
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
      }).map(function(f) {
        var dirname = f.replace(/\/example.*\.js/, '');            // get rid of 'example.1.js'
        var version_match = f.match(/\/example\.?(.*)\.js/, '$1'); // get the '1' from 'example.1.js'
        var version = '';
        if (version_match) {
            version = '.' + version_match[1];       // set version = '.1' for final mediatype
        }
        var dots = dirname.replace(/\//g, '.');                    // replace the /'s in the path with dots
        var mediatype = 'application/vnd.' + dots + version + '+json';
        return mediatype;
      }).then(function(files) {
        mediatypes_to_test = mediatypes_to_test.concat(files);
      });
    });
  });


  ////////////////////////////////////////////////////////////////////////////////
  // Run all the tests for each media type we found
  // You have to wrap this in .each because the before() isn't finished by the
  // time we get to here due to the promise.
  it('.each', function() {
    expect(mediatypes_to_test).to.be.an('array');
    expect(mediatypes_to_test).to.not.be.empty;
    _.each(mediatypes_to_test, function(p) {
      describe('('+p+'):', function() {
        it('should return a valid object with example and validate()', function() {
          var m = factory.require({ _mediaType: p });
          expect(m).to.be.an('object');
          expect(m).to.not.equal('null');
          expect(m.example).to.be.a('function');
          expect(m.validate).to.be.a('function');
        });
        it('should validate it\'s own example', function() {
          var m = factory.require({ _mediaType: p });
          return m.validate(m.example())
          .then(function(result) {
            expect(result).to.equal('true');
          });
        });
      });
    });
  });

});
