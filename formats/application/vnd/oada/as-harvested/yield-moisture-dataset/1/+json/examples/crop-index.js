module.exports = {
  _id: '02ijfkl3k20ij3fsf',
  _rev: '5-kojf2203iokflwdfs',
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

  // yield-moisture as-harvested data is the set of wet weights,
  // moisture readings, and GPS locations recorded by the harvester.
  // they are indexed by crop types here because you can't really
  // compare two crop type's harvest information, so it does't make sense
  // to include them both in the same yield-moisture set.

  indexing: {
    {
      index: 'year-index',
      value: '2018',
      source: 'oada.vocab.year',
    {
      index: 'crop-index',
      // List of known crop names in vocab/oada/index.js
      // since there is no "value" here, that means this index has yet to be chosen
      // On the next level down, it would contain the crop type as a value
      source: 'oada.vocab.crop-type',
    }
  },

  // links to a geohash-length-index fixed at 7 which then links to the 
  'soybeans': { 
    _id: 'kjf20oij3lk', 
    _rev: '4-kldjf20iofj3kl' 
    _type: 'application/vnd.oada.as-harvested.yield-moisture-data.1+json',
  },

  'corn': {
    _id: 'fj0o2i3jl3k2',
    _rev: '6-kldjf2io3lfke',
    _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
  },

};
   
