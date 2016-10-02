module.exports = {
  _id: "92jfik23o3iwe",
  _rev: "1-kdufj02ifj2klfklwef",
  _meta: { _metaid: "92jfik23o3iwe", _rev: "1-kfj029i3jfk2l3" },
  _type: "application/vnd.oada.person.1+json",

  // This is an extension of http://schema.org/Person.  I am focusing on
  // only data that is of immediate interest for the project at hand, but any
  // vocabulary from schema.org should be supported:

  givenName: 'Bob', // in the US, this is the first name
  familyName: 'Smith', // in the US, this is the last name
  email: 'bob@schmob.com',
  memberOf: { _id: 'kdj02lfsd', // link to an organization if this person belongs to on://github.com/oada/oada-formats 
              _type: 'application/vnd.oada.organization.1+json',
            },                  // note schema.org defines this key, and OADA is adding
                                // that it can be a link to an organization

  // A person can have their own bookmarks document, even if they are not a user
  // with login priviledges.  If, for example, a particular sensor hub is associated
  // with a particular person, it should reside at that person's bookmarks document.
  // If that person later becomes a user with login priviledges, that user can 
  // simply re-use the same bookmarks link.  If they are already a user, then
  // this link should be the same as that user's bookmarks document.
  bookmarks: { _id: 'kj0f2iklj23', _rev: '2-kjf02i3klj', _type: 'application/vnd.oada.bookmarks.1+json' },
}
