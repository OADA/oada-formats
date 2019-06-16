# Advanced concepts in oada-formats
-----------------------------------------

As mentioned in the main intro, you do not have to use these advanced concepts if they
do not fit your use cases.  However, many of the problems they solve will likely come
up for most realistic use cases, so please consider utilizing these tools to aid
in your development.

## Vocabularies, Duck Typing, and Accepting Things You Don't Understand
----------------------------------------

Often we don't get everything right the first time.  Schemas will need to be extended
over time as new use cases or concepts arise.  Making breaking changes to a schema
over time brings a slew of headaches, so it is smart to try to make backwards-compatible
changes wherever possible.

#### Duck Typing
The concept of "duck typing" lends itself well to this problem with JSON formats.  The
term comes from the English phrase "If it walks like a duck and quacks like a duck
then it is probably a duck."  In other words, rather than requiring a bunch of keys
on your entire schema, instead define particular keys to mean particular things, and
allow other keys that you don't know about to exist without invalidating the document.
If the keys you know are there and correct, then do not worry about extras.
In this way, you can always add new terms later, and you can learn a domain by gradually
building up a knowledge of commonly-used keys that always have the same kind of values
at them.  For example, you could define a `location` key should always be an object with known keys of
lat, lon, alt.  In any other schema that needs to store a location, you just re-use the 
schema for `location`.  This improves re-use and makes it easier to build a generalizable
knowledge, but be aware that it also increases coupling which can make future breaking changes 
to core terms much more difficult and far-reaching.

This set of domain-specific, commonly-used keys comprise what we've called a _vocabulary_,
in oada formats.  Each key has an associated small schema that describes it's value,
and you can build up composite schemas by making objects that contain other vocabulary
keys.  When you reach the level of a document-scale resource, you can then just
define its schema in terms of which vocabulary terms it uses.

It is impossible to create a single vocabulary that covers all
domains as most languages inevitably have some kind of incompatibility of
terms.  For example, `location` in a GPS context has lat, lon, alt, but `location` in 
a postal service context may have a street address, city, state, and zip code.  When this 
arises, you can either extend `location` to be more complex, or you can decide
that the two `contexts` are rarely used together for the same purposes.  If that is the case,
you can "bound" your contexts, to use Domain Driven Design terminology, to delineate that
these two uses belong to different vocabularies.  In this sort
of `bounded context` case, you will inevitably have to translate between contexts.  This 
does not mean that vocaularies are not extremely useful: each individual context benefits
greatly from having a vocabulary.  It simply means that you should expect to need to perform
translation when you cross context boundaries.

#### Recommending Default Acceptance of "Things You Don't Understand"
Therefore, we recommend using `additionalProperties: true` (the default) for all objects
in your json-schema's.   This means that every object will allow for non-pre-defined keys
to exist, thus making any additive change to a schema inherently backwards-compatible.

We also recommend allowing unknown values in enumerated types that do
not exist in the list of known things wherever possible.  For example, if your application
only knows how to deal with "corn" and "soybeans" as two known crop types, that doesn't mean
that a document with a crop type of "wheat" has to be considered globally invalid.  It should
instead be treated as an opportunity for expansion if you start seeing a lot of resources
with a crop type of "wheat".  This will enforce more defensive system design, but it also
makes for more realistic assumptions when dealing with outside systems.

In this way, it is advantageous to build systems flexible enough to accept documents
by default that may contain unfamiliar keys or values.  As such things come into your
systems, you can then assess the relative importance of various new features additions
by how often such items are coming in.  If the list of known crop types includes "pomengranite",
but you never see a document arrive at your system for a crop of "pomegranite", then you were 
likely wasting your time bothering to code for it.

#### Strict vs. Non-Strict Validation
The consequence of this is that it turns out using schemas for validation becomes inherently
meaningless.  Since all keys are allowed, unknown items are allowed in enumerated lists, and 
no particular keys are required (or at least minimally few are required), then every possible 
object would validate.  This makes some level of sense,
because we wanted a schema that would be future-proof, where we definitionally don't
know what the future document will look like.  

But consider that as a developer working on building a system that writes documents according
to some known schema, you would definitely like to know if you mispelled a key or enumerated
value.  You'd also like to know what are the typically accepted set of keys and values rather
than just "anything goes".  Or, more importantly, what sort of values you will likely receive
once your system goes live.

Our solution to this conundrum has been to introduce strict vs. non-strict validation.  In 
non-strict validation mode, you may have some minimal set of required keys wherever that makes sense,
and you can at least verify that if you have a `location` key for example, it is an object 
and not a string.  In strict mode, however, the library changes
all json-schema objects to have `additonalProperties: false` (i.e. disallow unknown keys),
and changes all "known" lists of values to official enumerated lists of values.  This way,
if you mispell a key of value, or forgot to put something in the schema, it will alert
you and you can go fix your code or the schema.  But in production, you can still
default accept items and simply flag ones that don't conform to what you're expecting.

## "known" values for lists
-----------------------------------------
## Strict vs. Non-strict Validation and "Accept-First" Methodology

// ---------------------------
// TODO: put example of enumSchema and known vs. enum.  Note that paragraph above 
// already talks about much of this, but need example!
// ---------------------------


## Concurrency and Convergent Replicated Data Types
-----------------------------------------

Imagine a situation where two tractors out in a field are generating location 
data (lat, lon, time, machineid) and sending it to a farmer's OADA service over 
the OADA API.  A naive approach to modeling this might be for the cloud to hold an
array of locations to which each machine is appending:

```http
// Naive model for location data
Request: 
  GET /bookmarks/locations
Response:
{
  _type: 'application/test.locations.1+json',
  locations: [
    { lat: 10.2, lon: -5.3, time: 123984723, machineid: 1 },
    { lat: 10.3, lon: -5.2, time: 123984723, machineid: 2 },
    { lat: 10.4, lon: -5.3, time: 123984724, machineid: 2 },
    { lat: 10.5, lon: -5.4, time: 123984725, machineid: 1 }
  ]
}

The problem with this is that if machine 1 and machine 2 both generate data at 
approximately the same time, each of them thinks there are 4 items (see above)
in the array so they need to PUT to the 5th item (index 4):
```http
Machine 1:
  PUT /bookmarks/locations/4
  { lat: 10.6, lon: -5.5, time: 123984726, machineid: 1 }

Machine 2:
  PUT /bookmarks/locations/4
  { lat: 10.7, lon: -5.6, time: 123984726, machineid: 2 }

```

Whichever request arrives at the OADA service second will overwrite the first one
because they both wrote the same keys (with different values) to index 4 in the array. 

Using a POST to leave it up to the server doesn't work either, because then the machine
cannot easily keep it's own cache of information without an always-on connection to the
server since it has to ask the server for the new index before it can add anything to
the array.  Similarly, writes in one OADA service can be re-played against a resource at a different
OADA service, thus effectively keeping one resource in sync with another.  If these two 
machines are talking to two different OADA clouds, when these two location documents are later
merged at either OADA cloud, the arrays will collide and overwrite at least some values.

To avoid this, use the concept of a Convergent Replicated Data Type in your model: a data
model that guarantees no collisions.  In our case, the kinds of collisions that occur are
writes to the same key in a resource.  They collide because we used an array to order them,
thus making both tractors pick the same key to write 2 different data points.
If we simply "un-order" them by using an object with random keys instead, suddenly we get
conflict-free merges:

```http
// CRDT model for location data
Request: 
  GET /bookmarks/locations
Response:
{
  _type: 'application/test.locations.1+json',
  locations: {
    "9dkfj209u3fjk": { lat: 10.2, lon: -5.3, time: 123984723, machineid: 1 },
    "kdsu0f23jkldd": { lat: 10.3, lon: -5.2, time: 123984723, machineid: 2 },
    "sssdkfjoewi99": { lat: 10.4, lon: -5.3, time: 123984724, machineid: 2 },
    "n8999983nefld": { lat: 10.5, lon: -5.4, time: 123984725, machineid: 1 }
  }
}
```

Now when writing, each machine will simply generate a sufficiently random string at which
to put any new data:

```http
Machine 1:
  PUT /bookmarks/locations/ie023jklf980f32i2
  { lat: 10.6, lon: -5.5, time: 123984726, machineid: 1 }

Machine 2:
  PUT /bookmarks/locations/981kwjd92j2d83664
  { lat: 10.7, lon: -5.6, time: 123984726, machineid: 2 }

```

And voila!  They no longer overwrite each other, and can even be safely merged between
different OADA services.  You can picture in your head two trees that interleave
each other at the bottom without any of the leaves bumping into each other when you
overlap the trees.

## Constructing a tree with OADA Links

Thus far most of our focus has been on how to define the schema for a single content
type.  However, when solving any real problem, you typically don't just define one
resource, you define a graph of content types that contain many kinds of resources.
To accomplish this, the natural place to specify how the graph fits together is
at the links within the schemas themselves.  In other words, a link schema can be
understood as a link _to_ some other type of resource.

Thsi library does not validate or test these link-type relationships currently as it
is focused on validating a single resource at a time.  It should, however, contain
enough information in it's schema tree to validate an entire OADA tree in the future
if need be, or to construct an appropriate tree for the `oada-cache` library.  Therefore,
we can use the OADA libraries to help us add these `_type` annotations to our 
set of resources.

We should not, however, constrain developers from being able to link resources in
new ways.  To solve this issue, we can simply re-use the `known` concept for
enumerated types defined earlier.  A schema therefore defines a set of _known_ resource
types for the link, not necessarily an exclusive set.  A script to validate a tree
could then treat the known types as exclusive when necessary.

In many cases, there may be more than
one possible `_type` for the linked document.  For example, in the case of a
food safety certification, the list of all certifications may contain links to
many different kinds of certification formats.  Therefore, `_type` for a `link`
can either be a single string or an array of strings.  This `_type` only 
lives under the `vocab` key in the schema that is added by the vocab library.
Therefore, the resulting schema for a vocab term that is a typed link should look
like this:

```javascript
{ 
  description: 'an example of a typed link',
  properties: {
    // same as a link:
    _id: { type: 'string' },
  }
  vocab: {
    // _type can be a single string or an array of strings:
    _type: [ 
      'application/vnd.trellisfw.audit.globalgap.1+json',
      'applicaiton/vnd.trellisfw.audit.primusgfs.1+json'
    ],
    // ... and the other vocab-defined keys ...
  }
```

You can use the `libVocab.link()` function to simplify this when registering links:

```javascript
register('certification', libVocab.link([
  'application/vnd.trellisfw.globalgap.1+json'
  'application/vnd.trellisfw.audit.globalgap.1+json',
  'application/vnd.trellisfw.audit.sqfi.1+json',
  'applicaiton/vnd.trellisfw.audit.primusgfs.1+json',
});
```
If you already have a vocab term defined that has some of the existing `_types`, and
you'd just like to add a new `_type` or two to what's there already, you can pass
an optional base schema for your link along with the new `_type`'s  to add:

```javascript
// Note how we can use override to replace the original description with our own:
register('ourPrivateCertificationLink', libVocab.override(
  libVocab.link('application/vnd.our.private.type.1+json', vocab('certification')),
  { description: 'A link to any normal certification or one of our private ones' }
));
```



## Dynamic Graph Indexing and Traveling Context for API's

### Graph Indexing
Consider the `locations` example above.  A list of machine-recorded "locations" has the potential
to become quite large, especially if locations are recorded frequently, say once per second for several
years.  In this case, our data model has a problem: the `/bookmarks/locations` resource itself is going to
become too large to be useable.

A natural solution to this would be to split up some of the points from the one resource into two or
more resources.  Since the OADA API represents relationships between resources as named links in a 
graph, we can conceptualize this "splitting" as making two separate files inside the same "locations" 
folder on a filesystem.

```
# ls /bookmarks/locations
a.json
b.json
c.json
```

Now if we choose meaningless names like "a", "b", and "c" above, we haven't really helped ourselves
much with the "too much data" problem.  This is because in order to find any given data point, we still
have to download and search through every point in every file until we find the one we want.  Had we
been more clever in our choice of file names, we could have avoided the need to load the files which 
did not contain the points we were looking for.  The concept of organizing data in a way that lets you
query without having to scan every item is known as `indexing`.

Within a graph, indexing manifests itself as choosing semantically-relevant terms for the file/folder names.
If you want to access location data by machine, then first make a `machines` folder, then put the location
data for a particular machine under it's own folder.  If you also want to find a data point from a particular
time, then make a `time-index` folder that contains folders who's name represent some chunk of time.  If you
want to find a point based on GPS coordinates, make a `geohash-index` folder that contains folders whose
names are geohashes which represent particular tiles on the globe.

You always get one index for free: i.e. the core place you are going to store data.
Other indexing schemes may point alternative paths through the graph to find data,
but you have to at least store the data under at least _one_ structure, so you should make this
core structure count by indexing it wisely:
* use reaonably immutable things for core indexing (i.e. don't index geospatial data by 
  arbitrarily-assigned field boundary names that are subject to change over time: use a geohash instead)
* the index itself should be a purely functional computation on the data itself
  (i.e. the data point itself should contain the actual things used to index it).

### But What About SQL?

For those who are used to SQL-style indexing, graph indexing can seem heavy at first.  In a relational
database, you just make big 2-D tables of similarly-structured things.  You can then write reasonably
expressive SQL commands to re-organize, query, mutate, count, etc. these rows in may different ways.
Importantly, in most simple cases, you do not have to specify when you put the data _into_ the database
just how you intend to pull it back _out of_ the database with a query.  This gives a developer the
illusion of being able to divorce writes from read models.  As most developers learn once their system
goes to production and starts getting large amounts of data, however, is that this was in fact 
an illusion: if you do not manually specify `indexes` on the columns that you want to query ahead of time,
then the database will have to look at every row in the table to figure out whether it satisfies
the query and it will be very slow as the number of rows becomes large.

The index will increase the size of your database because it will store additional information
about each row.  For example, if you set an index on a row with numbers in it, the database may
construct a list of mappings of `number -> row id`, and sort those according to the number.  When
you search for rows that have the number in some range, it is easy for the database engine to get 
the appropriate row id's out of the index without needing to look at all rows.  

Consider that this is actually the same situation we have in graph indexing: if you do not add
additional information to the database to help with efficient searching, then you will have
to look through every item in the database.  The difference here is that SQL masked this behind
it's syntax, but with an OADA graph, you need to manage this explicitly up-front in your API
data model.  

The reason for this is that OADA is targeted at defining industry-wide data sharing API's.  The
simplicity of the graph lends itself much better to such a diverse environment than details
necessary in relational databases like indexes, sharding, etc.  In addition, this allows the
client developer to have more control over how they access the data of interest to them.  

Most importantly, REST API's use URL's to access particular resources which are inherently
a representation of a graph (i.e. just like a filesystem `/folder1/folder2/file`).  By embedding
the indexing explicitly in the accepted graph schema, all ambiguity is removed about indexing,
querying, etc.: the URL paths that exist are naturally what's available on any given cloud.



### Dynamic Graph Indexing

A natural extension to this graph indexing concept is to keep the graph shallow until it grows too large,
and then progressively split nodes down into manageable sizes.  For the locations example above, if your
use case doesn't expect to have more than 10 or 20 points in its `locations`, then there is no
need to make a deep graph structure: just put the 10 points in the resource and be done with it.

However, if things change in production and that resource suddenly gets hundreds of thousands of 
points in it, your data handling mechanisms should be able to react by splitting the original
resource into smaller chunks according to a pre-defined indexing scheme.  For example, it could
start by grouping points by year, then by month, then day, then hour, etc.  

You want to keep 
both the data "bucket" resources and the indexing documents themselves manageably-sized.
For example, if you originally chose to index the locations
stream by hour, then the document which holds all the links to all the hour documents is going
to get really big once you have thousands of hours of data recorded.  At that point, it would make
sense to first index by day, then by hour, thus keeping each document size manageable.

This has a downside, however, in that any clients attempting to read this information will have
added complexity in discovering what level of indexing you are doing at any given time.  In addition,
it is no longer a purely functional computation on a datapoint to know the URL at which it should
be written.  A given location point could be written at `/bookmarks/locations` or
`/bookmarks/locations/hour-index/13:00`, or `/bookmarks/locations/day-index/2019-03-29/hour-index/13:00`:
you would have to navigate the graph to tell what's currently being used.  This "check-first-then-write"
can lead to race conditions unless you can make use of OADA's ability to do opportunistic locking 
(i.e. only let the write succeed if you sent the latest `_rev`).  

For that reason, one should attempt to design the domain model such that 
dynamic adjustments are as rare as possible by picking well-sized indexing for core data models.

### Traveling Index Context

There are many times that one could envision a particular resource being pulled out of an OADA
service and used elsewhere.  In this case, the semantic information contained in it's URL
is lost.  Some can be retained by keeping the `_type` on the resource.  For example, consider 
the OADA as-harvested yield-moisture-dataset.  It might live at a URL like:
```http
Request:
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset
Response:
  {
    _id: '9fj2kldf',
    _rev: '2',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    data: {
      '92kljdfoi2jf': { 
        lat: 5.6, 
        lon: -10.3, 
        time: 1934838322, 
        area: { value: '0.02', units: 'ac' },
        mass: { value: '2.8', units: 'bushels' },
        crop: { value: 'corn', source: 'oada.vocab.crops' },
      },
    }
  }
```

If I take that document out of the API, then the `_type` provides sufficient information
for me to know this is a document containing as-harvested yield+moisture data because
I can go lookup the schema and vocab terms in `oada-formats` to learn this.

However, since there are likely many, many points in such a dataset, we will inevitably want
a core index for them in addition to this semantic index.  A natural fit is to index by 
year, crop, and geohash.  Such a URL might look like:

```http
Request: 
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset/year-index/2019/crop-index/corn/geohash-index/d9782q3
Response:
  {
    _id: '9fj2kldf',
    _rev: '2',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    data: {
      '92kljdfoi2jf': { 
        lat: 7.1102142312,
        lon: -62.5650787423,
        time: 1553979143, 
        area: { value: '0.02', units: 'ac' },
        mass: { value: '2.8', units: 'bushels' },
        crop: { value: 'corn', source: 'oada.vocab.crops' },
      },
    }
  }
```

If someone gave you that document outside of the context of the API, you would not have
any way of knowing that it contained only points from 2018 for the crop "corn" within
the geohash tile d9782q3.  This may be important information depending on the use case.
Therefore, the natural solution to this is to create a `traveling context` for these
sort of core indexing terms: i.e. embed that information inside the resource itself. 
In this case, the traveling context for the indexing proposed here would therefore look
like:

```http
Request: 
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset/year-index/2019/crop-index/corn/geohash-index/d9782q3
Response:
  {
    _id: '9fj2kldf',
    _rev: '2',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    indexing: [
      { 
        index: 'year-index',
        value: '2018',
        source: 'oada.vocab.year-index',
      },
      {
        index: 'crop-index',
        value: 'corn',
        source: 'oada.vocab.crop-type',
      },
      {
        index: 'geohash-index',
        value: 'd9782q3',
        source: 'oada.vocab.geohash-index',
      },
    ],
    data: {
      '92kljdfoi2jf': { 
        lat: 7.1102142312,
        lon: -62.5650787423,
        time: 1553979143, 
        area: { value: '0.02', units: 'ac' },
        mass: { value: '2.8', units: 'bushels' },
        crop: { value: 'corn', source: 'oada.vocab.crops' },
      },
    }
  }
```

In this way, if someone gives you the document, you could reconstruct the core URL as well as 
have full knowledge of what is represented by the data in this document.  A general rule is 
therefore that truly semantic graph pieces should be handled by the content type, but 
scale-related indexing intended to keep documents a manageable size should be placed into the
document as a traveling context.

Another way of differentiating between these two types of "indexing" (semantic vs. scale) 
the scale-based indexing should be a purely functional calculation from
the values of the data points themselves.  You cannot know what the correct scale-based
indexing is for a data point unless you know the values contained in that data point.  This
is different than the semantic indexing in which you need not know anything about the actual
values in any of the data points to know what _kind_ of datapoint it is and therefore where
it should live in the graph.

Notice also that the content type of this document is the same as it was when `year-index`, `crop-index`,
and `geohash-index` weren't a part of the URL.  This has been our convention to avoid ballooning
the number of content types.  When you are indexing for scale, each level of indexing is the same 
`_type` as if the data itself had lived at that level.  Therefore, in the schema listed above, all of the 
following request/response pairs as we move down the URL graph have the same `_type` of 
`application/vnd.oada.as-harvested.yield-moisture-dataset.1+json` (pay attention to the URL's themselves
to see how they grow as you move through the graph):

```http
Request: 
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset
Response:
  {
    _id: '9fj2kldf',
    _rev: '2049',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    indexing: [ ],
    "year-index": { 
      2018: { _id: '90iojf2', _rev: '104' },
      2017: { _id: 'vvjd831', _rev: '987' },
      2016: { _id: 'qq9wjd3', _rev: '745' }
    }
  }
```
```http
Request:
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset/year-index/2018
Response:
  {
    _id: '9fj2kldf',
    _rev: '2049',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    indexing: [
      { 
        index: 'year-index',
        value: '2018',
        source: 'oada.vocab.year-index',
      },
    ],
    "crop-index": {
      "corn": { _id: '83jfkei', _rev: '102' },
      "beans": { _id: '98jf209', _rev: '98' }, 
      "wheat": { _id: 'ijf203k', _rev: '998" }
    },
  }
```
```http
Request:
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset/year-index/2018/crop-index/corn
Response:
  {
    _id: '9fj2kldf',
    _rev: '2049',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    indexing: [
      { 
        index: 'year-index',
        value: '2018',
        source: 'oada.vocab.year-index',
      },
      {
        index: 'crop-index',
        value: 'corn',
        source: 'oada.vocab.crop-type',
      },
    ],
    "geohash-index": {
      d9782q3: { _id: '38jf48d', _rev: '23' },
      d9782q4: { _id: '9f48hdj', _rev: '19' },
      d9782q7: { _id: 'mdf29ed', _rev: '27' },
      d9782q8: { _id: 'JDfi9hf', _rev: '22' },
      d9782q9: { _id: 'KD39dkd', _rev: '28' },
      d9782qa: { _id: 'A9A9dqf', _rev: '28' },
      d9782qb: { _id: 'ppfe1Dd', _rev: '29' },
      d9782qd: { _id: 'ZMkndW2', _rev: '13' },
    },
  }
```
```http
Request:
  GET /bookmarks/harvest/as-harvested/yield-moisture-dataset/year-index/2018/crop-index/corn/geohash-index/d9782q3
Response:
  {
    _id: '9fj2kldf',
    _rev: '2049',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    // The "indexing" key represents the traveling context
    indexing: [
      { 
        index: 'year-index',
        value: '2018',
        source: 'oada.vocab.year-index',
      },
      {
        index: 'crop-index',
        value: 'corn',
        source: 'oada.vocab.crop-type',
      },
      {
        index: 'geohash-index',
        value: 'd9782q3',
        source: 'oada.vocab.geohash-index',
      },
    ],
    data: {
      '92kljdfoi2jf': { 
        lat: 7.1102142312,
        lon: -62.5650787423,
        time: 1553979143, 
        area: { value: '0.02', units: 'ac' },
        mass: { value: '2.8', units: 'bushels' },
        crop: { value: 'corn', source: 'oada.vocab.crops' },
      },
    }
  }
```

Notice that in each intermediate indexing document, the presence of a particular index
value means that the dataset contains data for that value, and the absence of a value
means it does not.  For example, in the year-index above, we only see keys of 2016, 2017,
and 2018.  From this we can infer that the dataset does not have data in 2015, but it 
does have at least some data in 2016, 2017, and 2018.  Likewise, we see keys of "corn",
"beans", and "wheat" under 2018's crop-index document, but we do not see "strawberries",
therefore we can assume that in 2018, there is data for corn, beans, and wheat, but no
data for strawberries, even if such data does appear in other years.

Therefore, since all the example documents above have the same content type, then 
to build a schema for this content type we must "clutter" the schema up with 
all these possible responses based on whatever indexing is being used.  In addition,
we also need to augment the basic schema to have the appropriate indexing key added 
at each level for the traveling context.

Adding to this, as a developer, you would also like to know what is the accepted core indexing for this dataset.
Therefore, it should be easy to see that this particular data should be indexed as `year/crop/geohash`
rather than `crop/geohash/year` or `operator/lunar-cycle/crop`, etc.  It also should be possible to build a schema "viewer"
that can read the schema and example definitions in `oada-formats` and present some navigable
UI that lets them look around the data model.  We will discuss the current OADA solutions to these
requirements in the next sections.

### `indexing` extension with `oadaSchema`

To help with this, OADA has defined an `indexing` extension to json-schema that is used by the
`schemaUtils.oadaSchema`.  If you give it an array of vocabulary terms, OADA will take care of 
modifying your schema to support this indexing, thus leaving your main schema file uncluttered.
In addition, it maintains this information in the final schema it generates so that a UI can 
navigate the known indexing path.  The `indexing` key lives at the top-level of the schema so that it just 
looks like a regular traveling context:

```javascript
import { oadaSchema } from '../lib/oada-schema-util';
import { override, patterns } from '../lib/vocabs/oada';

// Pass the main schema object through oadaSchema:
module.exports = oadaSchema({
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
  description: "Here is an example schema using indexing keyword",

  // These are all vocab terms, ordering specified by array order:
  indexing: [ 'year-index', 'crop-index', 'geohash-index' ],

  // And here is the regular schema for this content type:
  properties: {
    // start with the regular generic data object, and override to specify particular data:
    data: override('data', {
      // keys under "data" are random strings (hence patternProperties instead of properties):
      patternProperties: {
        // This is a handy regular expression string from the vocab lib that avoids matching
        // keys that look like indexes, but does match any other random string.
        [patterns.indexSafePropertyNames]: {
          properties: arrayToProperties(['id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width']),
          required: [ 'area', 'weight', 'moisture', 'location' ],
        }
      }
    })
  },
};
```

This will produce a schema that allows the document to be any of the various intermediate 
indexing documents (listed above) in the order listed in the array, and each of these documents
gets the appropriate traveling context (indexing key) defined in it as well.  This way,
the "clutter" of indexing is minimized when reading the schema file itself.  On the downside,
it also does hide quite a bit of complexity behind convention which could confuse a developer
that is not intimately familiar with this structure.  Ideally this model would allow one to
gradually build up that knowledge as-needed.

If you want to specify a non-vocab term in the indexing array for a resource schema,
you need to make the schema look like this:
```javascript
import { oadaSchema } from '../lib/oada-schema-util';
import { override, patterns } from '../lib/vocabs/oada';

// Pass the main schema object through oadaSchema:
module.exports = oadaSchema({
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
  description: "Here is an example schema using indexing with manual schema",

  // These are all vocab terms, ordering specified by array order:
  indexing: [ 'year-index', {
    indexing: { index: 'special-crop-index', 
  }],

  // And here is the regular schema for this content type:
  properties: {
    // start with the regular generic data object, and override to specify particular data:
    data: override('data', {
      // keys under "data" are random strings (hence patternProperties instead of properties):
      patternProperties: {
        // This is a handy regular expression string from the vocab lib that avoids matching
        // keys that look like indexes, but does match any other random string.
        [patterns.indexSafePropertyNames]: {
          properties: arrayToProperties(['id', 'template', 'time', 'area', 'weight', 'moisture', 'location', 'width']),
          required: [ 'area', 'weight', 'moisture', 'location' ],
        }
      }
    })
  },
};

```

### Defining `*-index` Vocabulary Terms
Within the vocabulary, you can define a term that is intended to act as an index by 
using the same `indexing` extension to json-schema.  This should define what the object 
looks like in the traveling context for any schema that is going to use that index.  We 
recommend using a basic set of keys like `index`, `value`, `source` to indicate the name
of the index, the value chosen when navigating the index, and the source list identifier 
from which the possible values have been derived.

**Example 1: pattern-based index**
Here are examples for the `year-index` and `crop-index` terms from the example above.
Note this code snippet is what would go inside your vocabulary definition file, 
similar to `vocabs/oada/index.js`:
```javascript
// Our convention is to save various regular expression strings in 
global patterns variable
patterns.year = '^[0-9]{4}$';

register('year-index', {
  description: 'An index to split things up by year',
  // Here is the json-schema extension describing the index
  indexingSchema: {
    index: requireValue('year-index'),
    value: { type: 'string', pattern: patterns.year },
    source: 'oada.vocab.year',
  },
  // The rest just is a normal schema for what this resource would look like
  // at this level:
  patternProperties: {
    // In this case, the resource would look like a bunch of 4-digit string keys
    // that represent a year, and each one's value is a link to the same content type.
    // Note that the extension handilng code will fill in the `_type` for the link 
    // to at least go to the same content type.
    [patterns.year]: vocab('link'),
  },
});
```

In this `year-index` example, the `patternProperties` state that all keys in the object 
that look like a 4-digit year should have values that look like a link to another resource.
Additionally, when the `schemaUtil.oadaSchema` library sees the `indexing` key, it knows
that this small schema should be added to any traveling context in the overall resource schema.

**Example 2: index from set of known values**
Here is another example for a term whose possible values are a set of known strings:

```javascript
register('crop-type', enumSchema({
  description: 'A list of strings representing known crop types',
  type: 'string',
  known: [ 'corn', 'soybeans', 'wheat' ],
});

register('crop-index', {
  description: 'An index to split things up by crop-type',
  // Here is what the traveling index context object should look like:
  indexingSchema: {
    index: requireValue('crop-index'),
    value: vocab('crop-type'), // this gets the list of known crop types in here
    source: requireValue('oada.vocab.crop-type'),
  },
  // and here is what the actual contents of a crop-index should look like:
  properties: libVocab.arrayToProperties(vocab('crop-type').known, libVocab.vocab('link')),
  // The arrayToProperties function just returns an object whose keys are from the first
  // argument, and whose values are all the same schema from the second argument.
  // In this case, it will produce an object that is the same as if you did this:
  // {
  //    "corn": vocab('link'),
  //   "beans": vocab('link'),
  //   "wheat": vocab('link'),
  // }
});
```

In this case, we have a defined vocab term named `crop-type` that already contains a set of known
possible values.  The `crop-index` wants to use that vocab term for indexing.  Therefore,
it specifies it's traveling context with a value that looks the same as a `crop-type`, and a source
of `oada.vocab.crop-type`.  Then, since each of the known values can be keys that link to another
resource, it specifies each of the known values of `crop-type` as a possible key on the resource.

Since `schemaUtils.oadaSchema` will merge the properties from all the indexes used on the same
resource schema, you should avoid situations where two indexes have the same key.  In general, 
all that will happen when merged is the two keys will each have a value that is a link schema
and therefore two identical values will merge together as a single value at the same key.  However,
if this is not the case, then you should be aware that the merging will occur.


### `vocab._type` filled in automatically for index links by `schemaUtils.oadaSchema`

Recall that our convention for indexing is that intermediate indexing documents will
all have the same content type as the underlying resource that is being indexed in order
to avoid needing to define too many content types.  That means the schema for any of
the intermediate indexing resources will contain links that should say they point to the
same content type as the underlying resource.  

However, when you define a general vocabulary term, you don't know what resource 
types it is going to be used in: those will be defined in the resource schemas that
use the vocab term.  Therefore, the `schemaUtils.oadaSchema` function has a handy
feature that when you put a term in the `indexing` array, it will search through
that term's schema (properties or patternProperties) for any keys that look like 
a link and append the current schema's content type to the set of `vocab._type`'s 
on the link.

The index names themselves also appear in a tree as keys which link to the same resource
type.  If you pass either an index term or a schema with an "index" property in it in
the `indexing` array, the library will make sure each of those terms are present
in the schema's properties and that they link to the same resource type.


