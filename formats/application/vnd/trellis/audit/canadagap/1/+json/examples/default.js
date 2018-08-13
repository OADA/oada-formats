
// Things to know about writing JS files:
// - Lines that start with "//" are known as "comments" and are ignored
//
// - words followed by a ":" are called "keys".  
// - Keys don't need quotes around them unless the key has spaces, dashes, or punctuation marks in it
// - Most keys should only really contain letters, numbers, and underscores
// - The list of keys is defined here: https://github.com/OADA/oada-formats/blob/master/vocabs/trellis/index.js
//
// - anything to the right of a ":" is called a "value"
// - values must either be surrounded by braces { }, quotes " ", or brackets [ ].  
// - Either single ' ' or double " " quotes will work, but you can't mix and match like " '
// - every line should have a comma at the end after the value.
//
// - you can put comments (starting with two forward slashes // ) anywhere except between a key and it's value.
// - if you have a really long value and you want to break it into multiple lines to read, you
//   need to end each line with a quote " and begin the next line with a plus +.  Example below
//   under scope->description

// All files here should start with this "module.exports = {" line
module.exports = {
  // All CanadaGAP audits should have this type:
  _type: 'application/vnd.trellis.audit.canadagap.1+json',

  // A unique identifier for this certification chain of documents.  All documents
  // that reference the same inspection should have the same certificationid
  certificationid: {
    id_source: 'certifying_body', // CanadaGAP does not provide a scheme-defined ID for certifications
    id: 'Bobs Produce Audit 27',  // this can be any unique identifier that the certification body wants to create
                                  // and it only need be unique within that certification body.
  },


  // scheme: info about the type of audit
  scheme: {
    name: "CanadaGAP", 
    version: "7.0",
    option: "B", // Known options: A1, A2, A3, B, C, and D
  },
  
  // certifying body: info about who performed the audit
  certifying_body: { 
    name: "Audits R Us",
    auditor: { name: "Audrey Auditor" },  
  },

  // Organization contains information about the party being audited.
  organization: {
    // organizationid is the id of this organization withing the certifying body
    organizationid: {
      id_source: "certifying_body", // the certifying body already described in this document
      id: "PA−PGFS−000−0", // some unique string that identifies this organization within the certification body.
                           // it may be the same as the name itself if the certification body does not have
                           // such an ID.  However, it must be an exact and case sensitive match to the
                           // certification body's records, and be the only known string which represents this
                           // organzation at that certiciation body (i.e. you can't have "BOB'S PRODUCE" and "Bob's Produce"
                           // which refer in reality to the same organization but are different ID strings.
    },
    name: "Noel Produce Masters", // this is the same as the "legal operating name" or "group name" in CanadaGAP
    contacts: [ 
      { 
        name:  "Sam Noel", 
        contact_type: 'Recall Coordinator', // known types: Recall Coordinator, Responsible For Operation, and Food Safety Program Coordinator
      },
      { 
        name: "Jill Noel", 
        contact_types: [ 'Responsible For Operation', 'Food Safety Program Coordinator' ],  // shows how one person can be multiple contact types
      },
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
    email: "sam@noelproduce.com", // organization-wide email.  Can also have email in the individual people
    orgchart: {
      9kjfie: { // must be same as 'id' inside the object
        id: '9kjfie',  // an identifier to uniquely identify this person within this object, or globally
        name: 'Jill Noel',
        job_title: 'CEO',
        job_description: 'runs the place',
        // Since Jill has no "reports_to", she is a "root" at the top of the tree
      },
      jjjio6oe: { 
        id: 'jjjio6oe',
        name: 'Sam Noel',
        job_title: 'CTO',
        job_description: 'idea man',
        reports_to: [ '9kjfie' ], // this should be the keys within this object of all the people Sam reports to
      }, 
    },
  },

  conditions_during_audit: {
    operation_observed_date: {
      start: "2016-04-08T10:00:00Z-06:00", // combined audit date and start/end times
      end: "2016-04-08T11:30:00Z-06:00",
    },
  },

  // Scope: what sorts of things does this audit cover (operation, products, etc.)  
  scope: {
    notification: "announced", // either announced or unannounced
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

  // This part describes the overall structure of the document.  Odds are good that all PrimusGFS harvest crew reports
  // have the same sections and control points.  Note that a section may contain other sections, or it may contain control pointids.
  sections: [
    { 
      sectionid: '1',
      name: "Food Safety Management System",
      score: {
        preliminary: {
          value: '179',
          units: 'points',
        },
        final: {
          value: '194',
          units: 'points',
        },
        possible: {
          value: '194',
          units: 'points',
        }
      },
      sections: [
        {
          sectionid: '1.01',
          name: "Management System", 
          // Here is how the "score" for a section is represented:
          // Note that you either use "points" or "percent" for this but not both 
          // in order to keep the model simpler.  None-numeric values obviously
          // use their own set of strings.
          score: {
            preliminary: {
              value: '179',
              units: 'points',
            },
             final: {
               value: '194',
               units: 'points',
            },
            possible: {
              value: '194',
              units: 'points',
            },
          },
          control_pointids: [ '1.01.01', '1.01.02', '1.01.03', '1.01.04', '1.01.05', '1.01.06' ],
        },{
          sectionid: '1.02',
          name: "Control of Documents and Records",
          control_pointids: [ '1.02.01', '1.02.02', '1.02.03', '1.02.04' ],
        },{
          sectionid: '1.03',
          name: "Procedures and Corrective Actions Internal and External Inspections",
          control_pointids: [ '1.03.01', '1.03.02', '1.03.03', '1.03.04'],
        },{
          sectionid: '1.04', 
          name: "Rejection and Release of Product",
          control_pointids: [ '1.04.01', '1.04.02', '1.04.03', '1.04.04' ],
        },{
          sectionid:'1.05', 
          name: "Supplier Control Traceability and Recall",
          control_pointids: [ '1.05.01', '1.05.02', '1.05.03', '1.05.04', '1.05.05' ],
        },{
          sectionid: '1.06',
          name: "Supplier Control",
          control_pointids: [ '1.06.01', '1.06.02', '1.06.03', '1.06.04', '1.06.05', '1.06.06' ],
        },{
          sectionid: '1.07',
          name: "Tracability and Recall",
          control_pointids: [ '1.07.01', '1.07.02', '1.07.03' ],
        },{
          sectionid: '1.08',
          name: "Food Defense",
          control_pointids: [ '1.08.01', '1.08.02', '1.08.03' ],
        },
      ],
    }, {
      sectionid: '2',
      name: "Good Agricultural Practices",
      sections: [
        {
          sectionid: '2.11', 
          name: "Harvesting Inspections Policies And Training",
          control_pointids: [ '2.11.01', '2.11.02', '2.11.02a', '2.11.03', '2.11.04', '2.11.05', '2.11.06' ],
        },{
          sectionid: '2.12',
          name: "Harvesting Worker Activities And Sanitary Facilities",
          control_pointids: [ '2.12.01', '2.12.02', '2.12.03', '2.12.04', '2.12.05', '2.12.06', '2.12.06a', '2.12.07', '2.12.07a', '2.12.08',  
            '2.12.08a', '2.12.08b', '2.12.08c', '2.12.08d', '2.12.08e', '2.12.08f', '2.12.08g', '2.12.08h', '2.12.08i', '2.12.08j', '2.12.08k',
            '2.12.08l', '2.12.08m', '2.12.09', '2.12.10',  '2.12.10a', '2.12.10b', '2.12.10c', '2.12.10d', '2.12.10e', '2.12.10f', '2.12.10g', '2.12.10h',
            '2.12.10i', '2.12.10j', '2.12.10k', '2.12.11',  '2.12.11a', '2.12.11b', '2.12.12', '2.12.13', '2.12.13a', '2.12.14', '2.12.15', '2.12.15a',
            '2.12.16', '2.12.17' ],
        },{
          sectionid: '2.13',
          name: "Harvest Practices",
          control_pointids: [ '2.13.01', '2.13.02', '2.13.03', '2.13.04', '2.13.05', '2.13.06' ],
        },{
          sectionid: '2.14',
          name: "Harvest Practices Transportation and Tracking",
          control_pointids: [ '2.14.01', '2.14.02', '2.14.03', '2.14.04', '2.14.05', '2.14.06' ],
        },{
          sectionid: '2.15',
          name: "On Site Storage",
          control_pointids: [ '2.15.01', '2.15.02', '2.15.03', '2.15.04', '2.15.05', '2.15.06' ],
        },
      ],
    },
  ],
  // All the control points, regardless of section, go in this part.  Key is the 
  // control_pointid for that question
  control_points: {
    '1.01.01': {
      name: "Is there a Food Safety Manual or other documented food safety management system covering the scope of business included in this audit and procedures/instructions for all food safety processes?",
      // In the audit we transcribed, there weren't final or preliminary scores for each control
      // point, so we just use "value" below directly.
      score: {
        value: '5',
        units: 'points',
        possible: {
          value: '5',
          units: 'points',
        },
        // Global Gap audits will use compliance for pass/fail control points.
        // Their assigned "Level" will be specified with an "importance" key
        compliance: { 
          value: "Total Compliance", 
          units: "enum-pgfs-compliance", //This specifies an enumerated list of compliance levels used in PGFS control points
        },
      },
      auditor_comments: "Yes. They have a manual which covers the scope of the operation: procedures, risk analysis, etc.",
      files: [],
    },
    '1.01.02': {
      name: "Is there a documented food safety policy detailing the company ́s commitment to food safety?",
      score: {
        value: '5',
        units: 'points',
        possible: {
          value: '5',
          units: 'points',
        },
        compliance: { 
          value: "Total Compliance", 
          units: "enum-pgfs-compliance", 
        },
      },
      auditor_comments: "Yes. They have a document called Safety Policy. Policy posted on the office.signed and dated policy (16 / Jan / 2016) by management.published policy.",
      files: [],
    },
    '1.01.03': {
      name: "",
      score: {
        value: '2',
        units: 'points',
        possible: {
          value: '3',
          units: 'points',
        },
        compliance: { 
          value: "Minor Deficiency", 
          units: "enum-pgfs-compliance", 
        },
      },
      auditor_comments: "Mn.Have a document called Chart, dated (16.1.2016).job functions have.Lack positions include the role of the production department.Missing some alternates.",
      files: [],
    },
    '2.11.02': {
      name: "Was a pre−harvest inspection performed on the block being harvested and was the block cleared for harvest? If No, go to 2.11.03.",
      score: {
        value: '5',
        units: 'points',
        possible: {
          value: '5',
          units: 'points',
        },
        compliance: { 
          value: "Yes", 
          units: "boolean", 
        },
      },
      auditor_comments: "Yes. They have a record Registering weekly crop inspection personnel.",
      files: [],
    },
    '2.11.02a': {
      name: "Where pre−harvest inspections have discovered issues, have buffer zones been clearly identified and at the time of the audit, are these buffer zones being respected?",
      score: {
        value: '0',
        units: 'points',
        possible: {
          value: '0',
          units: 'points',
        },
        compliance: { 
          value: "N/A", 
          units: "enum-pgfs-compliance", 
        },
      },
      auditor_comments: "N / A.No problem.The score is not affected.",
      files: [],
    },       
  },
}
