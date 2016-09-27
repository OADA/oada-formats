{
  _id: '02ijfkl3k20ij3fsf',
  _rev: '5-kojf2203iokflwdfs',
  _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',

  // yield-moisture as-harvested data is the set of wet weights,
  // moisture readings, and GPS locations recorded by the harvester.
  // they are indexed by crop types here because you can't really
  // compare two crop type's harvest information, so it does't make sense
  // to include them both in the same yield-moisture set.

  context: {
    'harvest': 'as-harvested',
    'as-harvested': 'yield-moisture-dataset',
  },

  // List of known crops in vocab.js:
  'crop-index': {
    'soybeans': { _id: 'kjf20oij3lk', _rev: '4-kldjf20iofj3kl' },
    'corn': {
      _id: 'fj0o2i3jl3k2',
      _rev: '6-kldjf2io3lfke',
      _type: 'application/vnd.oada.as-harvested.yield-moisture-dataset.1+json',
    },
  },

}
   
