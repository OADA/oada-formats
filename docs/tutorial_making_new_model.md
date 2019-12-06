# Tutorial on Making a New Model with `oada-formats`
---------------------------------------------------

For this tutorial, we'll be making a model to represent a simple shopping list until
someone suggests a better example :).

## Step 1: make an example JSON document that represents the core of what you want.
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
You can find example vocabularies in [vocabs/oada/index.js](../vocabs/oada/index.js).  
You can copy that to your own folder under `vocabs/` and replace the terms defined in it
with your own terms.  

Schemas are defined with JSON Schema, if you're not familiar this resource is handy:
[https://json-schema.org/](https://json-schema.org/)

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

// Tell it we want a new vocabulary named 'groceries', then get a few
// functions out of the vocab to use below:
const { register, enumSchema, vocab, vocabToProperties, override } = LibVocab('groceries');

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
  // 'name' that we already defined above.  We could use our "vocab" function to retrieve the schema,
  // which would look like this:
  //   properties: { name: vocab('name') }
  // but notice we had to type "name" twice which kind of breaks the whole purpose of duck typing.
  // Therefore, LibVocab gives us a handy function to create a properties object from a set of 
  // existing vocab terms so we only have to type them once, and it's a bit easier to read:
  properties: vocabToProperties(['name']),
  
  // You can look at that like saying "An author has a name"
});

// productname is it's own key so we can record here a list of known productnames since
// that may come in handy for a developer in the future.  In strict mode the validator
// will alter the schema so that the string values are required to come from the known
// set, and in normal mode it will allow any value.  We represent this with the enumSchema()
// function from the vocabulary, which accepts either an array of terms, or an object with
// a "known" key in it that represents the known things.  In strict validation mode,
// enumSchema will put the "known" list of things as the "enum" list of things, which causes
// json-schema to require that the value be from the "enum" list.
//
// Also, we'll allow the productname to inherit from 'name': i.e. 
// a 'productname' should fit the criteria of a general name, but also more specific
// criteria of productnames with an enumerated set.  We accomplish this with the
// oada 'override' function.  'override' returns a schema object that starts with the 
// schema from the parent object, and then replaces any keys in the parent copy with
// the ones found in the child, thus "override"-ing the parent.
//
register('productname', override('name', enumSchema({
  description: 'A string with the name of the product to purchase.',
  known: [ 'apples', 'toothbrush', 'tape' ], // This is an extension to json-schema that enumSchema knows about
  // Since the "name" term we're overriding already sets the type as 'string', we don't repeat that here.
});

// A product is simply an object which contains a productname at this point.  We don't
// ever actually use the key 'product' in the example, but it will be helpful to make
// a vocab term representing a single product so that 'products' can be defined as
// just an array of these things.
register('product', {
  description: 'product is not used anywhere as a key, but rather represents what a single '
              +'product object looks like for reference ',
  properties: vocabToProperties(['productname']),
});

register('products', {
  description: 'products is an array of objects containing productnames, representing all the '
              +'items currently to be purchased on the grocery list.',
  // The vocab function will return the schema for a given vocab term, in this case, the
  // 'product' term we just defined above.  'items' is used by JSONSchema to indicate that
  // something is an array, and it's items should each adhere to this item schema.
  items: vocab('product'), 
});
```

## Step 3: make a format using your new vocab:
Decide what you want your format's content-type string to be.  In this example,
let's say it should be `application/vnd.test.grocerylist.1+json`.  By our convention
(which you don't have to use if you don't want to), that's read as the first verion of
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
const { vocabToProperties } = vocab;

// schemaUtil.oadaSchema has some nice features that know how to deal with links, _type's, 
// oada-defined things like _id, _rev, _meta, etc., and more.  Therefore, just take the schema
// we would normally have defined, and pass it to schemaUtil.oadaSchema to process it.
// 
module.exports = schemaUtil.oadaSchema({
  description: 'A GroceryList schema holds information about what we need to buy this week at the store',
  // We can re-use the vocabToProperties function to easily build out our schema here.
  // If you have more to add, just merge the result of vocabToProperties for vocab terms with
  // any additional custom items (underscore.js has a nice merge function for this)
  properties: vocabToProperties([ 'author', 'products']),
});
```

## Step 4: Done!
There you go: now run the tests `npm run test` and it will verify automtically
that all the files you wrote actually compile under node, and it will
verify that the example you gave passes the schema you wrote.  If you pass
the strict flag `npm run test -- --strict=true`, then it should alert you 
(and fail validation) if any keys are used that are not explicitly vocab terms,
or if your example uses a "known" list-type term like `productname` above,
but tries to use a string that is not in the known list.

## Advanced concepts
To continue with more advanced concepts, please [refer to this explanation](./oada-tools.md).
