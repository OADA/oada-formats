var _Bookmarks = function(version) {
  // There is only one version for now
  return {
    example: function() {
      return { 
        irrigation: { _id: 'dummyid012jkfle', _rev: '1-dummyuufd02i' },
          planting: { _id: 'dummyid112jkfle', _rev: '1-dummyuufd02i' },
           sensors: { _id: 'dummyid112jkfle', _rev: '1-dummyuufd02i' },
      };
    },

    validate: function() {
      throw new Error("validate: not implemented");
    },
  };

};

module.exports = _Bookmarks;
