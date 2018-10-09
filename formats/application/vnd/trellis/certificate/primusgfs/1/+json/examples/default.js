
// Things to know about writing JS files:
// - Lines that start with "//" are known as "comments" and are ignored
// - words followed by a ":" are called "keys".  
// - Keys don't need quotes around them unless the key has spaces, dashes, or punctuation marks in it
// - Most keys should only really contain letters, numbers, and underscores
// - The list of keys is defined here: https://github.com/OADA/oada-formats/blob/master/vocabs/trellis/index.js
// - anything to the right of a ":" is called a "value"
// - values must either be surrounded by braces { }, quotes " ", or brackets [ ].  
// - Either single ' ' or double " " quotes will work, but you can't mix and match like " '
// - every line should have a comma at the end after the value.
// - you can put comments anywhere except between a key and it's value.
// - if you have a really long value and you want to break it into multiple lines to read, you
//   need to end each line with a quote " and begin the next line with a plus +.  Example below
//   under scope->description

// Primus GFS audit certificate. Because this document is largely a summary
// of the audit document, its corresponding JSON format is largely comprised of
// a subset of the audit.

// All files should start with this "module.exports = {" line
module.exports = {
  // All primus GFS audits should have this type:
  _type: 'application/vnd.trellis.audit.primusgfs.1+json',

  // A unique identifier for this certification chain of documents.  All documents
  // that reference the same inspection should have the same certificationid
  certificationid: {
    id_source: 'scheme',
    id: '00000 - Cert: 0', // labeled as "Primus GFS ID" in the audit report
  },

  // scheme: info about the type of audit
  scheme: {
    name: "PrimusGFS", // Does GFSI maintain a list of strings which would be valid here?
    version: "2.1-2",
  },
  
  // certifying body: info about who performed the audit
  certifying_body: { 
    name: "Primus Auditing Operations",
    auditor: { name: "Aaron Auditor Ault" },
  },

  // Organization contains information about the party being audited.
  organization: {
    // organizationid is the id of this organization withing the certifying body
    organizationid: {
      id_source: "certifying_body", // the certifying body already described in this document
      id: "PA−PGFS−000−0",
    },
    name: "Noel Produce Masters",
    // The value below starts and ends with brackets [], indicating this 
    // is a list of things.  Each thing is surrounded by braces { }
    contacts: [ 
      { name: "Sam Noel" },
    ],
    location: {
      street_address: "123 Nonexistent Street",
      postal_code: "00000",
      city: "Nowhere",
      state: "Florida",
      country: "USA",
      // location can also contain latitude, longitude, altitude as decimal numbers
    },
    phone: "0000000000",
  },

  // Scope: what sorts of things does this audit cover (operation, products, etc.)  
  scope: {
    description: "Harvest crew audit of GFS activities, personnel, sanitation, crop area, "
                +"tools, etc. were observed and applicable documents.They were observed approx.10 "
                +"people in the activity.", 
    operation: {
      operation_type: 'harvest',
      operator: { // the harvest crew
        contacts: [ 
          { name: "Sam Noel" } 
        ],
        name: "Noel Produce - Linked to Greenhouse Noel Produce Masters",
      },
      // Open question: does shipper belong inside the harvest crew,  or as it's own thing at same level as "crew"
      shipper: { name: "Noel's Happy Tomato" },
      location: {
        address: "124 Nonexistent Street",
        city: "Lafayette",
        state: "IN",
        postal_code: "47907", 
        country: "USA",
      }
    },
    products_observed : [ 
      { name: "Tomatoes" },
    ],
    similar_products_not_observed: [ 
      { name: "Tomatoes Organic" },
    ],
    products_applied_for_but_not_observed: [ ], // empty array, or just leave the key off if none
  },

  conditions_during_audit: {
    // what should we call it if there is just a single "audit date"?
    FSMS_observed_date: {
      // The dates below must use this exact format.  
      // Year, month, day, letter "T", time in 24-hour format, letter "Z", offset to UTC time for timezone
      start: "2016-04-08T17:00:00Z-06:00", 
      end: "2016-04-08T19:00:00Z-06:00",
    },
    operation_observed_date: {
      start: "2016-04-08T10:00:00Z-06:00",
      end: "2016-04-08T11:30:00Z-06:00",
    },
  },

  score: {
    // Preliminary is filled in after first audit, before corrective actions,
    // unless no corrective actions are necessary, then just copy preliminary to final.
    preliminary: { 
      value: '96', 
      units: "%" 
    }, // valid units are "%" only for now
    // Final is the score after corrective actions are taken.
    // If this is not the final audit, the "final" key is not here.
    // Therefore the test for whether this is the final audit or not is "if (!score.final)"
    final: { 
      value: '100', 
      units: "%" 
    },
    // This can also have "value" and "units" at the top level if there is a "current" score
  },


  certificate_validity_period: {
    start: "2016-04-11",
    end: "2017-04-11",
  },
}
