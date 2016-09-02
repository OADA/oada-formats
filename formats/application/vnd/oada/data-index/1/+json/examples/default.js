{

  _id: '92jfik23o3iwe',
  _rev: '1-kdufj02ifj2klfklwef',
  _meta: { _metaid: '92jfik23o3iwe', _rev: '1-kfj029i3jfk2l3' },
  // I called this "data index" so it could be reused across many
  // types of indexing schemes by just using the appropriate keys.
  // At the moment I can't think of anything that needs to go here
  // other than timehashes, so supporting timehashes, geohashes, etc.
  // should be relatively simple.
  _type: 'application/vnd.oada.data-index.1+json',

  // timehash-7 is a set of unix timestamps in the UTC timezone 
  // for which data exists, with the
  // last 7 digits zero-ed out.  Any sample whose timestamp is the same
  // as the timehash here when it's last 7 digits are zero-ed out will be 
  // included in that document.  Note these keys are integer numbers rather than
  // numeric strings.  Note also there is no particular order guaranteed for
  // these in the response.
  // 'timehash-7' is considered an example: any number may be appended to the 
  // string 'timehash-' to be a valid index., and multiple indexes can exist 
  // here simultaneously.
  'timehash-7': {
    1440000000: { _id: '02kjflk2j0fi323', _rev: '2-kdjf092j3flkf3' },
    1450000000: { _id: 'dm2f90hf203j2l3', _rev: '1-kjf02j2kfl3kf3' },
  },

  // another available indexing scheme is geospatially via geohash
  // (a truncated geohash represents a well-defined rectangular tile
  // on the earth, and any georeferenced data within that tile would be expected 
  // to reside at the linked document for a given geohash key.)
  'geohash-7': {
    df874j3: { _id: 'k02jfi2l3f', _rev: '4-kdfj02ijf3lk3fj' },
    df874j5: { _id: 'kk0d2kfl3f', _rev: '4-kdfj02ijf3lk3fj' },
  },

  // simply a set of random, unordered, unorganized data is a "list" index:
  list: {
    'foj2039ilwdf': { _id: 'ifjk2eoi', _rev: '6-kdfj02f3kl' },
    'mdlfkwjefoli': { _id: 'klfj02i3', _rev: '2-ofjk9023kk' },
  },

}
