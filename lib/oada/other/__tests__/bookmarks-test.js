jest.dontMock('../bookmarks.js');

describe('bookmarks', function() {
  it('returns an example that validates properly', function() {
    var bookmarks = require('../bookmarks.js');
    var result = bookmarks.validate(bookmarks.example());
    expect(result).toBeDefined();
    expect(result.valid).toBe(true);
  });
});
