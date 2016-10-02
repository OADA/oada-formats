module.exports = {
  _id: "92jfik23o3iwe",
  _rev: "1-kdufj02ifj2klfklwef",
  _meta: { _metaid: "92jfik23o3iwe", _rev: "1-kfj029i3jfk2l3" },
  _type: "application/vnd.oada.organization.1+json",

  // This is an extension of http://schema.org/Organization.  I am focusing on
  // only data that is of immediate interest for the project at hand, but any
  // vocabulary from schema.org should be supported:

  name: 'Seventh Bank of Omaha',
  contactPerson: { _id: 'k2jfko3lf2k3f' }, // schema.org does not have this currently

  // An organization can have it's own bookmarks document.  This would come in handy 
  // in the case where an organization is a client of another organization, and the
  // first organization also has clients and other things defined in bookmarks.
  bookmarks: { 
    _id: 'kj0f2iklj23', 
    _rev: '2-kjf02i3klj', 
    _type: 'application/vnd.oada.bookmarks.1+json' 
  },
}
