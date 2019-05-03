[![Build Status](https://travis-ci.org/OADA/oada-formats.svg?branch=master)](https://travis-ci.org/OADA/oada-formats)
[![Coverage Status](https://coveralls.io/repos/OADA/oada-formats/badge.svg?branch=master)](https://coveralls.io/r/OADA/oada-formats?branch=master)
[![Dependency Status](https://david-dm.org/oada/oada-formats.svg)](https://david-dm.org/oada/oada-formats)
[![License](http://img.shields.io/:license-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

# oada-formats
The purpose of this repo is to act as an inventory of known ag data formats.
Since the OADA API uses content type strings to identify types, the formats here
are organized by content type: if you receive a file via the OADA API, you should
be able to use it's content-type to look up details on its format here.

[Tutorial for making your own new model](./docs/tutorial_making_new_model.md)


## If you want to look at known formats, look for folders named "examples" [in here](./formats/application/vnd/oada).

We believe it is simplest to learn about a format by seeing examples of that
format.  Therefore, all formats included here should have a least one example,
and most of the details about any given format exist as comments
directly in the examples.  You can also supply a schema to do validation, but 
the examples should still be the main source of knowledge about the format.

This repo contains models for all formats whose format is known from a given
media type. Each model consists of a module with `validate()`, `schema()`, and
`example()` functions. Some base model types, e.g., JsonModel, are available for
use.

`oada-formats` exposes a `Formats` class that acts as a repository of models.
The `model()` function is a factory function for various mediatype models. The
`use()` function can be used to extend the model types and model repository. See
[valleyix-formats][valleyix-formats] for an example. `oada-formats` comes with
OADA defined formats pre-loaded by default.

## OADA-specific Extensions and Helpers ##
In building the various schemas that we have thus far, we have put together
some helpful functions and concepts such as:
* vocabularies, 
* graph-based indexing, 
* "known" values for lists, 
* and strict vs. non-strict validation.  

These have turned into rather more complex topics than originally intended. 
While you do not have to use them to define your own formats (you just need 
to define an example and validation() function or json-schema), we have found
them helpful, and you will find the see concepts throughout this repo.

For a more complete deep-dive into what they mean and how they work,
please [refer to this explanation](./docs/oada-tools.md).


## Installation ##
```shell
npm install oada-formats
```

## Usage ##

If you have an application in which you would like to validate an OADA
schema, here is how you would use this library to load a schema and
then validate a document against it (note that the `example()` function
returns an actual document that should validate):

```js
import Formats from 'oada-formats';
// Make a validator, tell it to use your package
const formats = new Formats();

// Now select a model (from the _type field of an OADA resource, for example)
formats
  .model('application/vnd.oada.bookmarks.1+json')

  // Once the model has loaded, promise returns it and you can call validate
  .then(model => model.validate(model.example()))

  // which will return a promise that is eventually true, or it throws the error
  .then(/* success */)
  .catch(Format.ValidationError, function(error) {
    console.log(error.errors);
  });
```

And here is a more advanced example of all the various things you can do with 
a model, as well as how to extend with your own custom formats:

```js
import Formats from 'oada-formats';
// If you are just using OADA and nothing custom, you don't need to
// use this next line.  It is only for adding your own custom extensions:
import someModelPackage from 'your-favorite-model-package';

const formats = new Formats();
// And here is how you tell it to use your custom extensions:
formats.use(someModelPackage);

formats.model('application/vnd.oada.as-harvested.yield-moisture-dataset.1+json')
.then(model => {
  // You can get all of the exmaples for a particular format:
  model.examples().then(console.log);
  // You can get a particular example for a format:
  model.example('default').then(console.log);
  // You can get the JSON schema itself for a particular format
  model.schema().then(console.log);
});
```

# Adding JSON Models

The `JsonModel` can be used to add new json models easily.
[valleyix-formats][valleyix-formats] is a good example.

1. Build a directory structure where each folder in the hierarchy is the next
   word of the format's mediatype, split on `/` and `.`.
2. At the root of the directory structure there must be an index.js that exposes
   a plain old object. It may have any property names, however, `JsonModel` will
   load the values of properties `examples` and `schema` as the format's
   examples and schema respectively. An array of `function(data)` implementing
   custom validation rules can be stored under the `addtionalValidators`
   property. `index.js` may expose the plain old object, a promise of a plain
   old object, or a plain old object with promises at its first level of
   properties. Therefore any type of asynchronous loading can be done, e.g.,
   http or database.
3. If there is not an `examples` property then any `js` or `json` file in an
   `examples` directory at the root of the mediatype directory structure will be
   loaded in as the examples. The example name will be the filename without it's
   file extension.
4. If there is not a `schema` property then a `schema.js` or `schema.json` file
   at the root of the mediatype directory structure will be loaded in as the
   schema.


