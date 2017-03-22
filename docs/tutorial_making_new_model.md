# Tutorial on Making a New Model with `oada-formats`
===================================================

For this tutorial, we'll be making a model to represent a simple shopping list until
someone suggests a better example :).

## Step 1: make an example JSON document that represents the core of what you want.
-----------------------------------------------------------------------------------
```javascript
module.exports = {
  // The person who made the list:
  author: { name: "Brian Fellows" },
  // The stuff they want to buy:
  products: [
    { productname: "apples" },
    { productname: "toothbrush" },
    { productname: "tape" },
  ]
}
```
Some comments:
* the "module.exports = " part is so you can import this directly as javascript code.
  If you don't use this, you'll need to make it valid JSON which is a pain, because
  valid JSON doesn't allow for trailing commas, unquoted keys, or comments.  
  `module.exports` is more universally supported than the ES6 `export default`, but you can
  use whatever you prefer.
* In this case, the existence of an array makes this format susceptible to race condition
  problems if multiple people try to update the array simultaneously.  To avoid that, you
  could make "products" an object with random keys rather than an ordered array.


## Step 2: figure out a common vocabulary from your example(s) to aid in duck typing.
-----------------------------------------------------------------------------------

Odds are good that you'll end up making a few models for things that you want to fit 
together.  We've found that building a vocabulary of key names makes it much simpler
to write the schema later.  Basically, for any key name that appears in your examples,
come up with the schema that you would always expect to find at that key.

This idea is known as *duck typing*: a key may or may not exist, and if it does exist it 
should have some known form.  The term duck typing comes from the English phrase
"If it walks like a duck and it talks like a duck then it's probably a duck."  If the
object has a `productname` key, then the value at that key is probably a `productname`
and if it does not have a `productname` key, then this object is probably not the sort
that has `productname` keys in general.  This lets your models evolve and add keys
over time while minimizing problems with backward compatibility.

`oada-formats` has a set of handy functions to help you define a vocabulary and schemas.
You can find example vocabularies in (vocabs/oada/index.js)[../vocabs/oada/index.js].  
You can copy that to your own folder under `vocabs/` and replace the terms defined in it
with your own terms.  

Schemas are defined with JSON Schema, if you're not familiar this resource is handy:
(https://spacetelescope.github.io/understanding-json-schema/index.html)[https://spacetelescope.github.io/understanding-json-schema/index.html]

In our case for this tutorial, it looks like these are the total set of keys that we 
defined:
* author
* name
* products
* productname

So let's make a vocabulary that defines those 4 things, trying our best to require as little
as possible since lack of flexibility usually causes problems later:

```javascript
// Get the main vocab library:
import LibVocab from '../../lib/vocab';
// Tell it we want a new vocabulary named 'groceries'
const groceryVocab = LibVocab('groceries');
// Pull out the functions we want so we have less typing later
const { register, enumSchema, vocab, sameAs } = groceryVocab;

// Define the terms in the order you need them: i.e. an author uses
// a name, so you have to define name before author.

// register's first argument is the name of the vocab term you are registering,
// and the second is the JSON schema for that term.
register('name', {
  // always put a description in the schema for any term so other people know
  // what this is supposed to be:
  description: 'name is a general key that refers to the name of just about anything.',
  // Now put in requirements that it's value should be a string:
  type: 'string',
});

// Now things get interesting: when we define an author, we'll define it as an object
// that can have any key it wants, but if it has a name key then the name key should 
// follow the schema we already defined for name.
register('author', {
  description: 'an author is an object with the name of the person who created this grocery list.',
  // In normal JSONSchema, we should do this:
  // properties: { name: { type: 'string' } },
  // However, that's hard to read to figure out what's going on, and it fails to re-use the
  // 'name' that we already defined above.  OADA defines a handy JSONSchema extension key
  // named "propertySchema".  If the value at this propertySchema is a schema for an
  // enumerated type, it will assume the known values in that type are vocabulary terms.  
  // Behind the scenes, it will fill in your JSON Schema object for you from the vocabulary!
  // Since I think the JSONSchema for an enumerate type is a little verbose and unclear, 
  // I made a special function named 'enumSchema' that returns a JSON Schema for an 
  // enumerated set of strings, but it's a bit clearer what it's trying to accomplish.
  // This form is critical if later you want to specify that a particular value may
  // be any of the known keys on some object: the known set of keys will be stored
  // in that object's propertySchema.
  propertySchema: enumSchema([ 'name' ]),
});

// productname is it's own key so we can record here a list of known productnames since
// that may come in handy for a developer in the future.  In strict mode the validator
// will alter the schema so that the string values are required to come from the known
// set, and in normal mode it will allow any value.  Also, just for the purposes of
// having an example, we'll allow the productname to inherit from 'name': i.e. 
// a 'productname' should fit the criteria of a general name, but also more specific
// criteria of productnames with an enumerated set.  We accomplish this with the
// oada 'sameAs' function.  'sameAs' returns a schema object resulting from
// deep merging the schema for the vocab term specified in the first argument
// with the overriding object specified in the second argument.
register('productname', sameAs('name', {
  description: 'A string with the name of the product to purchase.',
  // "known" is an oada extension to JSON schema that simply stores
  // an array of known values for something.  When in strict mode, this set
  // becomes an enumerated set that is required, and in normal mode it just
  // stores 'known' on the object for developer reference, but it doesn't affect the 
  // schema validation.  In this case, these are the known set of productname's
  // that have been seen in an example document of this type.
  known: [ 'apples', 'toothbrush', 'tape' ],
});

// A product is simply an object which contains a productname at this point.  We don't
// ever actually use the key 'product' in the example, but it will be helpful to make
// a vocab term representing a single product so that 'products' can be defined as
// just an array of these things.  The resulting schema looks just like the author schema,
// using the oada extension 'propertySchema' key and enumSchema helper function.
register('product', {
  description: 'product is not used anywhere as a key, but rather represents what a single '
              +'product object looks like for reference ',
  propertySchema: enumSchema(['productname'])
});

register('products', {
  description: 'products is an array of objects containing productnames, representing all the '
              +'items currently to be purchased on the grocery list.',
  // The vocab function will return the schema for a given vocab term, in this case, the
  // 'product' term we just defined above.  'items' is used by JSONSchema to indicate that
  // something is an array, and it's items should adhere to this item schema.
  items: vocab('product'), 
});
```

## Step 3: make a format using your new vocab:
----------------------------------------------
Decide what you want your format's content-type string to be.  In this example,
let's say it should be `application/vnd.test.grocerylist.1+json`.  By our convention
(which you don't have to use if you don't want to), that's the first verion of
the `test.grocerylist` format serialized as JSON.  

Split up that string on any non-letter/number characters into a directory tree and
make that tree under `formats/`.  In this case, we'd create
`formats/application/vnd/test/grocerylist/1/+json`.  Inside that folder, make 
an `examples` folder, and copy in your example as `default.js`.  Then, at the 
same level of `examples`, we'll now need to create `schema.js` to define our
whole model:

```javascript
import schemaUtil from '../../../../../../../../lib/schema-util';
import vocab from '../../../../../../../../vocabs/groceries';
const { enumSchema } = vocab;

module.exports = schemaUtil.oadaSchema({
  description: 'A GroceryList schema holds information about what we need to buy this week at the store',
  // See how simple this is now to build a model from the vocab terms?  Just put
  // the names of the vocab terms here and schemaUtil.oadaSchema will do the rest.
  propertySchema: enumSchema([ 'author', 'products']),
});
```

## Step 4: Done!
---------------------------------------------------------
There you go: now run the tests `npm run test` and it will verify automtically
that all the files you wrote actually compile under node, and it will
verify that the example you gave passes the schema you wrote.  If you pass
the strict flag `npm run test -- --strict=true`, then it should alert you 
(and fail validation) if any keys are used that are not explicitly vocab terms.
