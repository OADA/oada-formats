
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

// All files should start with this "module.exports = {" line
module.exports = {
  // All primus GFS audits should have this type:
  _type: 'application/vnd.trellis.audit.primusgfs.1+json',
  
  // scheme: info about the type of audit
  scheme: {
    name: "PrimusGFS", // Does GFSI maintain a list of strings which would be valid here?
    version: "2.1-2",
  },
  
  // certifying body: info about who performed the audit
  certifying_body: { 
    registration_number: "PAâˆ’PGFSâˆ’000âˆ’0", // what does this register?  Primus Auditing Ops with PrimusGFS?
    name: "Primus Auditing Operations",
    auditor: { name: "Aaron Auditor Ault" },  
  },

  // Organization contains information about the party being audited.
  organization: {
    primus_gfs_id: "00000",
    certification: "7",
    name: "Noel Produce Masters",
    // The value below starts and ends with brackets [], indicating this 
    // is a list of things.  Each thing is surrounded by braces { }
    contacts: [ 
      { name: "Sam Noel" },
    ],
    location: {
      stree_address: "123 Nonexistent Street",
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
      type: 'Harvest Crew',
      // if type is Harvest Crew, key = "crew", if it is anything else, key = "facility"
      crew: {
        contacts: [ 
          { name: "Sam Noel" } 
        ],
        name: "Noel Produce - Linked to Greenhouse Noel Produce Masters",
        // Open question: does shipper belong inside the harvest crew,  or as it's own thing at same level as "crew"
        shipper: { name: "Noel's Happy Tomato" },
        location: {
          address: "124 Nonexistent Street",
          city: "Lafayette",
          state: "IN",
          postal_code: "47907", 
          country: "USA",
        },
      },
      products_observed : [ 
        { name: "Tomatoes" },
      ],
      similar_products_not_observed: [ 
        { name: "Tomatoes Organic" },
      ],
      products_applied_for_but_not_observed: [ ], // empty array, or just leave the key off if none
    },
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
      score: {
        preliminary: {
          value: '382',
          units: 'points',
        },
        final: {
          value: '387',
          units: 'points',
        },
        possible: {
          value: '387',
          units: 'points',
        },
      },
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
    '1.01.03': {
      name: "Is there an organizational chart of all workers who have food safety related activities?",
      score: {
        preliminary: {
          value: '5',
          units: 'points',
          possible: {
            value: '5',
            units: 'points',
          },
          compliance: { 
            value: "Minor Deficiency", 
            units: "enum-pgfs-compliance", 
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
      },
      auditor_comments: "Mn.Have a document called Chart, dated (16.1.2016).job functions have.Lack positions include the role of the production department.Missing some alternates.",
      files: [],
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
    },
    '1.03.03': {
      name: "Is there a corrective action procedure that describes the requirements for handling deficiencies affecting food safety and prevention of future occurrences?",
      score: {
        preliminary: {
          value: '',
          units: 'points',
          possible: {
            value: '5',
            units: 'points',
          },
          compliance: { 
            value: "Minor Deficiency", 
            units: 'enum-pgfs-compliance',
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "Yes. They have a record Registering weekly crop inspection personnel.",
      files: [],
    },
    '1.05.05': {
      name: "Is there a documented system for dealing with customer and buyer food safety complaints/feedback along with records and company responses, including corrective actions?",
      score: {
        preliminary: {
          value: '0',
          units: 'points',
          possible: {
            value: '0',
            units: 'points',
          },
          compliance: { 
            value: "Major Deficiency", 
            units: "enum-pgfs-compliance", 
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        }
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "MJ.It has a record called \"Registering complaints and suggestions\".the procedure is missing.",
      files: [],
    },
    '1.06.01': {
      name: "Are there current written food safety related specifications for all raw products, ingredients, materials and services purchased?",
      score: {
        preliminary: {
          value: '3',
          units: 'points',
          possible: {
            value: '5',
            units: 'points',
          },
          compliance: { 
            value: "Minor Deficiency", 
            units: 'enum-pgfs-compliance',
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        }
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "Mn.They have a document called \"Accredited providers\".service providers and materials are included.Missing specifications calibration providers, consulting and third−party proceedings.Date 20 / Jan / 2016.",
      files: [],
    },
    '1.06.03': {
      name: "Is there a list of approved suppliers?",
      score: {
        preliminary: {
          value: '3',
          units: 'points',
          possible: {
            value: '5',
            units: 'points',
          },
          compliance: { 
            value: "Minor Deficiency", 
            units: 'enum-pgfs-compliance',
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        }
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "Mn.They have a document called \"Accredited providers\".service providers and materials are included.Missing calibration providers, consulting and third−party proceedings.",
      files: [],
    },
    '1.08.02': {
      name: "Is there a current list of emergency contact phone numbers for management, law enforcement and appropriate regulatory agencies?",
      score: {
        preliminary: {
          value: '3',
          units: 'points',
          possible: {
            value: '5',
            units: 'points',
          },
          compliance: { 
            value: "Minor Deficiency", 
            units: 'enum-pgfs-compliance',
          },
        },
        final: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        }
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Total Compliance',
            units: 'enum-pgfs-compliance',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'format with corrective actions is attached, as well as the missing positions and the new organization with alternates.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "Mn.They have emergency telephones, missing regulatory agencies.",
      files: [],
    },
    '2.11.01': {
      name: "Have self−audits been completed for this harvest crew?",
      score: {
        preliminary: {
          value: 'No',
          units: 'boolean',
          compliance: { 
            value: "", 
            units: 'enum-pgfs-compliance',
          },
        },
        final: {
          compliance: {
            value: 'Yes',
            units: 'boolean',
          }
        }
      },
      corrective_action: {
       score: {
          compliance: {
            value: 'Yes',
            units: 'boolean',
          }
        },
        files: [],
        organization_response: 'The following Corrective Action has been performed', // should this be an enum field
        organization_comments: 'corrective action file is attached.Within the same are the necessary files.the new format gang harvest was created and first internal audit was conducted.',
        decision: { value: 'accepted', units: 'enum-pgfs-actiondecision' },
      },
      auditor_comments: "No. missing internal audit report harvest crew.",
      files: [],
    },
  },
}
