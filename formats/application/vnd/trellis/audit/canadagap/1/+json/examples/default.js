
// Comments on the general rules used to create this CanadaGAP schema and example:
//
// - CanadaGAP does not have a strict hierarchy for their sections (section A for
//   example is split into two sub-sections), and many of the official control points contain
//   multiple yes/no responses.  This schema models each checkbox that is not simply
//   an "n/a" for a section or control point as it's own control point.
//
// - If a checkbox is "n/a" for an entire question or section, it does not get labeled as it's own 
//   control point, it simply results in a "score" for that section with a value of "n/a"
//
// - If a checkbox is an "n/a", but there are multiple ways that a particular section can be "n/a"
//   and these boxes indicate which one caused the "n/a", then each of the "n/a explanation" boxes 
//   gets its own supporting_point.
//
// - If a set of checkboxes is just "Y", "N", "INC", and/or "n/a", then they are treated as all
//   individual supporting_points with units "yes-no-inc-n_a"
//
// - Since CanadaGAP does not provide a definitive numbering scheme for the supporting_points,
//   we will define a strict one here.  In general, supporting points are numbered top to bottom,
//   the left to right.  If there are supporting points in the auditor key section (which is on 
//   the right), then it will start numbering after all the main supporting points from the
//   left-hand main column for a control point.  
//
// - A "section" or control point can definitely have a "score" that is not just an adding up of the
//   scores of the control points or supporting points under it.  For example, some "sections" like 
//   H3 have multiple checkboxes that have values in units of 'yes-no', but the score for the overall 
//   section is a number that seems to be the discretion of the auditor depending on the yes-no answers.  
//
// All files here should start with this "module.exports = {" line so we can use javascript
// syntax and comments instead of raw JSON.  To get the actual JSON format, import
// this file and then serialize it to JSON.
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
    version: "7.1",
    options: [ 'B', 'C' ], // Known options: A1, A2, A3, B, C, and D
  },
  
  // certifying body: info about who performed the audit
  certifying_body: { 
    name: "Audits R Us",
    auditor: { 
      name: "Audrey Auditor", 
      conflict_of_interest: false,  // whether the auditor has a conflict of interest (true) or not (false)
      number_prior_audits_this_organization: '2', // how many times this auditor has previously audited this operation
      number_prior_consecutive_audits_this_organization: '0', // hwo many times consecutively, not including this audit
    },  
    reviewer: {
      name: 'Richard Reviewer',
      review_date: '2018-06-03T13:01:01Z-06:00',
    },
  },

  // Organization contains information about the party being audited.
  organization: {
    GLN: '1234567890128', // if available, this is the global location number assigned by GS1
    // organizationid is the id of this organization withing the certifying body
    organizationid: {
      id_source: "certifying_body", // the certifying body already described in this document
      id: "Noel_Produce", // some unique string that identifies this organization within the certification body.
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
      name: 'The Big Farm', // For CanadaGAP, this refers to the "name of audited location (for multi-site certification)
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
        id: '9kjfie',  // an identifier to uniquely identify this person within this object, or globally. 
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
    individuals_present: [
      { name: 'Sam Noel', },
    ],
    // This is a free-form text explanation (from canadagap) only for why the audit duration
    // was less than the minimum requirement.
    audit_duration_rationale: 'Sunspots', 
  },

  // Scope: what sorts of things does this audit cover (operation, products, etc.)  
  scope: {
    notification: "announced", // either "announced" or "unannounced"
    is_multisite: false,

    operations: [
      { operation_type: 'production' },
      { operation_type: 'storage' },
    ],
    operations_applied_for_but_not_observed: [
      { operation_type: 'packing', }
    ],

    products_observed : [ 
      { name: "tomatoes" },
    ],
    products_applied_for_but_not_observed: [
      { name: 'kiwi' },
    ],

    // applicable_sites_description is a free-form text description of sites applicable to this audit.
    applicable_sites_description: 'Whole operation (production sites, packing house with storage)',
  },

  previous_certification: {
    conditions_during_audit: {
      operation_observed_date: {
        start: '2014-08-13T11:00:00Z-06:00',  // date of previous audit
      },
    },
    certifying_body: { name: "Audits R Us 2", } // who did the previous audit
    scheme: {
      name: "CanadaGAP", 
      version: "7.1",
      options: [ 'B', 'C' ], // Known options: A1, A2, A3, B, C, and D
    },
    scope: {
      operations: [
        operation_type: 'harvest',
      ],
      operations_applied_for_but_not_observed: [],
      products_observed: [
        { name: 'tomatoes' },
      ],
      products_applied_for_but_not_observed: [],
    },
  },

  score: {
    value: '100', units: "%",
    possible: { value: '100', units: '%' },
    canadagap_isautofail: false, // true/false based on "autofail" section
    subtotals: [
      {
        name: '1', // CanadaGAP: 1, 2a, 2b, 3, 4, 5, 6, 7
        sectionids: [ 'A.1-3', 'A.4-5', 'B', 'C', 'D', ],
        weighting_factor: '0.15', // must be a string for signature to be consistent
        score: {
          value: '19', units: 'points',
          possible: { value: '19', units: 'points', },
        },
      },
      // other subtotals are same structure as the first one: 2a, 2b, 3, 4, 5, 6, 7
    ],
  },

  sections: [

    // This section with ID "autofail" is unique to CanadaGAP:
    { 
      sectionid: 'autofail', // special section in CanadaGAP
      name: 'Automatic Failure Items',
      score: {
        canadagap_isautofail: false, // true if any controlpoints have a 'true' canadagap_isautofail
      }
      control_pointids: [ 
        'autofail.1', 'autofail.2', 'autofail.3', 'autofail.4', 
        'autofail.5', 'autofail.6', 'autofail.7', 'autofail.8' 
      ],
    },

    // Note: CanadaGAP splits section "A" into 2 sections, and uses those two
    // sections independently in the subtotal weightings.  They do not fit cleanly
    // into a hierarchy, so they sit "beside" the main control points A.1 and A.2,
    // but also "contain" them.

    // Section A of audit:
    {
      sectionid: 'A',
      name: 'Food Safety Program Maintenance and Review',
      score: {
        value: '16.0', units: 'points,
        possible: { value: '16.0', units: 'points' },
      },
      control_pointids: [ 'A.1', 'A.2', 'A.3', 'A.4', 'A.5' ],
      sections: [
        {
          sectionid: 'A.1-3',
          name: 'Food Safety Program Maintenance and Review - Questions 1-3',
          score: {
            value: '8.0', units: 'points',
            possible: { value: '8.0', units: 'points', }
          },
          control_pointids: [ 'A.1', 'A.2', 'A.3' ],
        },
        {
          sectionid: 'A.4-5',
          name: 'Food Safety Program Maintenance and Review - Questions 4-5',
          score: {
            value: '8.0', units: 'points',
            possible: { value: '8.0', units: 'points', }
          },
          control_pointids: [ 'A.4', 'A.5' ],
        },
      ],
    },

    // This is an example of an entire section marked as "n/a".  In this
    // case, you would ignore the answers in the individual control points
    // for that section.
    // Section B:
    {
      sectionid: 'B',
      name: 'Commodity Starter Products',
      score: { value: 'n/a', units: 'n/a' },
      control_pointids: [ 'B.1', 'B.2' ],
    },

    // Section C has a similar structure to section A: a series of numbered questions C1...C7, 
    // but they are split into non-identified sub-sections of Production Sites and Buildings.  In order
    // to keep the sectionid's as similar as possible to the spreadsheet (i.e. C.1, C.2, etc.),
    // we will put the Premises and Buildings sub-sections as special sections "beside" the
    // sections which are the actual C1...C7.  One difference here is that while "production sites"
    // can be entirely "N/A" vs. Buildings which cannot, they do not seem to aggregate a score for
    // each sub-section.  So, even though it would be simple to add the questions together, I 
    // leave the score out here in this example in order to match the spreadsheet.
    // Section C:
    {
      sectionid: 'C',
      name: 'Premises',
      score: {
        value: '33.0', units: 'points',
        possible: { value: '38.0', units: 'points', }
      },
      control_pointids: [ 'C.1', 'C.2', 'C.3', 'C.4', 'C.5', 'C.6', 'C.7' ],
      sections: [
        {
          sectionid: 'C1-2',
          name: 'Premises - Production Sites - Questions 1-2',
          control_pointids: [ 'C.1', 'C.2' ],
        },
        {
          sectionid: 'C3-7',
          name: 'Premises - Buildings - Questions 3-7',
          sectionids: [ 'C.3', 'C.4', 'C.5', 'C.6', 'C.7' ],
        },
      ],
    },

    // All other sections clearly follow the same construction rules as prior sections, so 
    // omitting here for brevity
  ],



  // All the control points, regardless of section, go in this part.  Key is the 
  // control_pointid for that question
  control_points: {
    'autofail.1': {
      name: 'An immediate food safety risk is present (e.g., livestock/poultry slaughter '
           +'activities) when product is produced, handled, packed, repacked, stored or held '
           +'under conditions that promote or cause the product to become contaminated.',
      score: { final: { value: 'no', units: 'yes-no' } },
    },
    'autofail.2': {
      name: 'Animal/bird/human feces and/or presence/evidence of rodents is observed on '
           +'food contact surfaces in use, and/or in/on product, during handling, packing/repacking, '
           +'and/or storage of market product',
      score: { final: { value: 'yes', units: 'yes-no' } },
      auditor_comments: 'Bird droppings were observed directly on packed, market product that was '
                       +'being loaded onto a truck for shipping",
    },
    // ... and so on with other autofail points ...


    // Section A's control points:
    'A.1': {
      sectionid: 'A.1',
      name: 'A1: A CanadaGAP Manual is being used?',  // labeled "A1" in spreadsheet
        score: {
          final:       { value: '4.0', units: 'points', },
          possible:    { value: '4.0', units: 'points', }
        },
        // A supporting_point is just like a section in that it contains other things that look like 
        // control points, but it lives semantically under the main control point.  Note that some
        // of the supporting points are found under the "Auditor Key" column, but others are in the
        // main left-hand control point column.  Both should go here, with the left-hand ones
        // numbered first and increasing in number from top to bottom, then the right-hand ones
        // are numbered next and increasing in number from top to bottom.  If a given auditor
        // comment does not fit under a supporting point description, then it should go in the
        // "auditor_comments" key at the same level as score, supporting_points, etc.
        supporting_points: {
          'A.1.1': {
            name: 'A CanadaGAP manual is being used?',
            score: { value: 'yes', units: 'yes-no' },
          },
          'A.1.2': {
            name: 'Have the manual(s) been updated to the most recent version? (2 points)',
            score: { value: 'yes', units: 'yes-no-inc' },
          },
          'A.1.3': {
            name: 'Have the manual(s) been completed? (2 points)',
            score: { value: 'yes', units: 'yes-no-inc' },
          },
          'A.1.4': {
            name: 'Which CanadaGAP manual(s) or other manual(s) are being implemented?',
            score: { value: 'Fruit and vegetable manual', units: 'text' },
          },
          'A.1.5': {
            name: 'What is the version number of the manual(s)?',
            score: { value: 'Version 7.1', units: 'text' },
          },
        },
      },
    'A.2': {
      sectionid: 'A.2',
      name: 'A2: Was an annual review of the program completed?',
      score: {
        value: '2.0', units: 'points',
        possible: { value: '2.0', units: 'points', }
      },
      supporting_points: {
        'A.2.1': {
          name: 'Was an annual review of the program completed?',
          score: { value: 'yes', units: 'yes-no-inc' },
        },
      },
    },
    // ... and so on for A3-A5 ...

    // Section B in this example is N/A, so there is no need to include it's control points

    // Section C's control points:
    'C.1': {
      name: 'New production sites have been assessed for the presence of heavy metals and other contaminants?',
      score: { 
        value: '2.0', units: 'points',
        possible: { value: '2.0', units: 'points', },
      },
      auditor_comments: 'Manual section has been checked off. Auditee only has one new field being rented '
                       +'in the last 5 years. This field was previously soybeans and other cashcrops.',
      supporting_points: {
        'C.1.1': {
          name: 'New production sites have been assessed for the presence of heavy metals and other contaminants?',
          score: { value: 'yes', units: 'yes-no-n_a' },
        },
      },
    },
    'C.2': {
      name: 'C2: Production sites',
      score: {
        value: '12.0', units: 'points',
        possible: { value: '12.0', units: 'points', },
      },
      auditor_comments: 'Adjacent areas are other horticultural production of similar crops. Large '
                       +'buffer zones and wind breaks are in place to prevent agricultural chemical drift.',
      supporting_points: {
        'C.2.1': {
          name: 'Have been assessed for potential hazards from adjacent areas and animal/bird activity? (4 points)',
          score: { value: 'yes', units: 'yes-no-inc' },
        },
        'C.2.2': {
          name: 'Are used where sewage sludge has NOT been applied? (4 points)',
          score: { value: 'yes', units: 'yes-no' },
        },
        'C.2.3': {
          name: 'Annual production site assessment has been completed and recorded? (4 points)',
          score: { value: 'yes', units: 'yes-no-inc' },
        },
      },
    },
    'C.3': {
      name: 'A sketch of the interior of all buildings includes:',
      score: {
        value: '3.0', units: 'points',
        possible: { value: '4.0', units: 'points', },
      },
      auditor_comments: 'The building sketch is missing the location of market ready packaging '
                       +'materials. They have no heating oil or fuel tank storage in the building '
                       +'so this requirement is not applicable.'
      supporting_points: {
        'C.3.1':  { score: { value:  'no', units: 'yes-no' }, name: 'No sketch' },
        'C.3.2':  { score: { value: 'yes', units: 'yes-no' }, name: 'Packing/Repacking line(s)' },
        'C.3.3':  { score: { value: 'yes', units: 'yes-no' }, name: 'Pest Control Devices and Pest Control Product Storage' },
        'C.3.4':  { score: { value: 'yes', units: 'yes-no' }, name: 'Harvested and Market Product' },
        'C.3.5':  { score: { value: 'yes', units: 'yes-no' }, name: 'Hand washing Facilities' },
        'C.3.6':  { score: { value: 'yes', units: 'yes-no' }, name: 'Washrooms' },
        'C.3.7':  { score: { value:  'no', units: 'yes-no' }, name: 'Market ready packaging materials' },
        'C.3.8':  { score: { value: 'yes', units: 'yes-no' }, name: 'Agricultural Chemical Storage' },
        'C.3.9':  { score: { value: 'yes', units: 'yes-no' }, name: 'Container/Tank/Cistern Storage (i.e., heating oil/fuel, water)' },
        'C.3.10': { score: { value: 'yes', units: 'yes-no' }, name: 'Type of Building: Packinghouse' },
        'C.3.11': { score: { value:  'no', units: 'yes-no' }, name: 'Type of Building: Repacking Facility' },
        'C.3.12': { score: { value:  'no', units: 'yes-no' }, name: 'Type of Building: Greenhouse Production Site' },
        'C.3.13': { score: { value:  'no', units: 'yes-no' }, name: 'Type of Building: Product Storage' },
        'C.3.14': { score: { value:  'no', units: 'yes-no' }, name: 'Type of Building: Wholesale Facility' },
        // For "Other" below, if there is an "other" (i.e. it's value is yes), then there will also be
        // an "auditor_comments" key here with whatever the auditor wrote to describe the other type of building
        'C.3.15': { score: { value:  'no', units: 'yes-no' }, name: 'Type of Building: Other' }, 
      },
    },
    // ... and so on for C4-C7 ...

    // Most of the control points clearly follow the same ruleset as the examples given above.
    // Some of them are more complex, however, so I've included some here explicitly as examples.
    
    // Control point I.1 has a lot of checkboxes, so to avoid ambiguity we'll list them all out here in order:
    'I.1': {
      name: 'Production Site Employee(s) Washroom(s) and Hand washing Facility(ies)',
      // if N/A (no production site), then score is just { value: 'n/a', units: 'n/a' }
      auditor_comments: 'No handwashing in production site for production site employees. '
                       +'Production site employees have access to a washroom which has '
                       +'handwashing - AUTOFAIL',
      canadagap_isautofail: true,
      score: { value: '0.0', units: 'points', possible: { value: '10.0', units: 'points' } },
      supporting_points: {
        'I.1.1':  { name: 'Production site washrooms', score: { value: 'yes', units: 'yes-no' } },
        'I.1.2':  { name: '# of toilets', score: { value: '2', units: 'number' } },
        'I.1.3':  { name: '# of production site employees', score: { value: '32', units: 'number' } },
        'I.1.4':  { name: 'Stocked with toilet paper', score: { value: 'yes', units: 'yes-no' } },
        'I.1.5':  { name: 'Properly stocked handwashing facilities IN the production site or IN the '
                        +'header house/entrance/ service room/connecting house (Greenhouse)', 
                   score: { value: 'yes', units: 'yes-no' } },
        'I.1.6':  { name: 'Hand washing facility NOT required', score: { value: 'no', units: 'yes-no' } },
        'I.1.7':  { name: 'Explain why it is not required', score: { value: '', units: 'text' } },
        'I.1.8':  { name: 'Option 1 - Potable Water', score: { value: 'no', units: 'yes-no' } },
        'I.1.9':  { name: 'Option 1 - Potable Water', score: { value: 'no', units: 'yes-no' } },
        'I.1.10': { name: 'Option 1 - Soap', score: { value: 'no', units: 'yes-no' } },
        'I.1.11': { name: 'Option 2 - Water', score: { value: 'no', units: 'yes-no' } },
        'I.1.12': { name: 'Option 2 - Paper Towel', score: { value: 'no', units: 'yes-no' } },
        'I.1.13': { name: 'Option 2 - Hand Sanitizer', score: { value: 'no', units: 'yes-no' } },
        'I.1.14': { name: 'Option 3 - Hand Wipes', score: { value: 'no', units: 'yes-no' } },
        'I.1.15': { name: 'Option 3 - Hand Sanitizer', score: { value: 'no', units: 'yes-no' } },
      },
    },

    // I.3 is also pretty extensive in it's supporting points: it's like I.1 tripled (57 checkboxes!):
    'I.3': {
      name: 'Packing/Repacking and Product Storage Employee(s) Washroom(s) and Hand washing Facility(ies)',
      auditor_comments: 'Packinghouse has a washroom and properly stocked handwashing facilities. Product '
                       +'storage is in the packinghouse therefore the same facilities are used.',
      canadagap_isautofail: false, // a false autofail, or no canadagap_isautofail key at all should be considered equivalent
      score: { value: '10.0', units: 'points' },
      supporting_points: {
        'I.3.1':  { name: 'Washrooms - Packinghouse', score: { value: 'yes', units: 'yes-no-n_a' } },
        'I.3.2':  { name: 'Washrooms - MRPHB', score: { value: 'n_a', units: 'yes-no-n_a' } },
        'I.3.3':  { name: 'Washrooms - Product Storage', score: { value: 'yes', units: 'yes-no-n_a' } },
        'I.3.4':  { name: 'Washrooms - # of toilets - Packinghouse', score: { value: '2', units: 'number' } },
        'I.3.5':  { name: 'Washrooms - # of toilets - MRPHB', score: { value: '0', units: 'number' } },
        'I.3.6':  { name: 'Washrooms - # of toilets - Product Storage', score: { value: '0', units: 'number' } },
        'I.3.7':  { name: 'Washrooms - # of employees - Packinghouse', score: { value: '15', units: 'number' } },
        'I.3.8':  { name: 'Washrooms - # of employees - MRPHB', score: { value: 'n/a', units: 'n/a' } },
        'I.3.9':  { name: 'Washrooms - # of employees - Product Storage', score: { value: '0', units: 'number' } },
        'I.3.10': { name: 'Washrooms - Stocked with toilet paper - Packinghouse', score: { value: 'yes', units: 'yes-no' } },
        'I.3.11': { name: 'Washrooms - Stocked with toilet paper - MRPHB', score: { value: 'n/a', units: 'n/a' } },
        'I.3.12': { name: 'Washrooms - Stocked with toilet paper - Product Storage', score: { value: 'yes', units: 'yes-no' } },
        'I.3.13': { name: 'Properly stocked handwashing facilities (i.e IN the packinghouse, FOR the product storage, '
                         +'and FOR the MRPHB) - Packinghouse', 
                    score: { value: 'yes', units: 'yes-no-n_a' } 
                  },
        'I.3.14': { name: 'Properly stocked handwashing facilities (i.e IN the packinghouse, FOR the product storage, '
                         +'and FOR the MRPHB) - MRPHB', 
                    score: { value: 'n_a', units: 'yes-no-n_a' } 
                  },
        'I.3.15': { name: 'Properly stocked handwashing facilities (i.e IN the packinghouse, FOR the product storage, '
                         +'and FOR the MRPHB) - Product Storage', 
                    score: { value: 'yes', units: 'yes-no-n_a' } 
                  },
        'I.3.16': { name: 'Option 1 - potable water - Packinghouse',    score: { value: 'yes', units: 'yes-no' } },
        'I.3.17': { name: 'Option 1 - potable water - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.18': { name: 'Option 1 - potable water - Product Storage', score: { value: 'yes', units: 'yes-no' } },
        'I.3.19': { name: 'Option 1 - soap - Packinghouse',    score: { value: 'yes', units: 'yes-no' } },
        'I.3.20': { name: 'Option 1 - soap - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.21': { name: 'Option 1 - soap - Product Storage', score: { value: 'yes', units: 'yes-no' } },
        'I.3.22': { name: 'Option 1 - paper towel - Packinghouse',    score: { value: 'yes', units: 'yes-no' } },
        'I.3.23': { name: 'Option 1 - paper towel - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.24': { name: 'Option 1 - paper towel - Product Storage', score: { value: 'yes', units: 'yes-no' } },
        'I.3.25': { name: 'Option 2 - water - Packinghouse',    score: { value: 'n/a', units: 'n/a' } },
        'I.3.26': { name: 'Option 2 - water - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.27': { name: 'Option 2 - water - Product Storage', score: { value: 'n/a', units: 'n/a' } },
        'I.3.28': { name: 'Option 2 - paper towel - Packinghouse',    score: { value: 'n/a', units: 'n/a' } },
        'I.3.29': { name: 'Option 2 - paper towel - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.30': { name: 'Option 2 - paper towel - Product Storage', score: { value: 'n/a', units: 'n/a' } },
        'I.3.31': { name: 'Option 2 - hand sanitizer - Packinghouse',    score: { value: 'n/a', units: 'n/a' } },
        'I.3.32': { name: 'Option 2 - hand sanitizer - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.33': { name: 'Option 2 - hand sanitizer - Product Storage', score: { value: 'n/a', units: 'n/a' } },
        'I.3.34': { name: 'Option 3 - hand wipes - Packinghouse',    score: { value: 'n/a', units: 'n/a' } },
        'I.3.35': { name: 'Option 3 - hand wipes - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.36': { name: 'Option 3 - hand wipes - Product Storage', score: { value: 'n/a', units: 'n/a' } },
        'I.3.37': { name: 'Option 3 - hand sanitizer - Packinghouse',    score: { value: 'n/a', units: 'n/a' } },
        'I.3.38': { name: 'Option 3 - hand sanitizer - MRPHB',           score: { value: 'n/a', units: 'n/a' } },
        'I.3.39': { name: 'Option 3 - hand sanitizer - Product Storage', score: { value: 'n/a', units: 'n/a' } },
      },
    },


    // I.1 and I.3's complexity pales in comparison to L3.  "L3" is split into two control points,
    // 'L.3A' and 'L.3B', and L.3A has a LOT of checkboxes.  I've chosen to just keep the 
    // 'L.3A' and 'L.3B' monikers without making some kind of aggregate 'L3'.
    // This is the last and most complex example control point.  
    'L.3A': {
      name: 'Describe how and what ALL water used on product and for handwashing is for '
           +'(e.g., treated well water for handwashing, municipal water for final rinse '
           +'of carrots, well water to fill flumes for tomatoes, etc.).',
      auditor_comments: 'AUTOFAIL- no tests completed for final rinse water (same '
                       +'packingline is used for both tomatoes and peppers). Auditee assumed '
                       +'tests on the well were sufficient.  Same well is source of all water. '
                       +'Two tests were taken from the well which showed potability of the water '
                       +'used for handwashing and cleaning of equipment. Dump tank water is treated '
                       +'- treated water was tested separately with 2 tests.',
      canadagap_isautofail: true,
      score: { value: '0.0', units: 'points', possible: { value: '10.0', units: 'points' } },
      supporting_points: {
        'L.3A.1': { 
          name: 'Describe how and what ALL water used on product and for handwashing is for '
               +'(e.g., treated well water for handwashing, municipal water for final rinse '
               +'of carrots, well water to fill flumes for tomatoes, etc.).',
          score: { 
            value: 'One well is used to fill a dump tank and for final rinsing of '
                  +'tomatoes and peppers.  The same well water is used for handwashing '
                  +'and cleaning of equipment',
            units: 'text'
          },
        },
        'L.3A.2': { name: 'ONLY Municipal water is used?', score: { value: 'no', units: 'yes-no' } },
        'L.3A.3': { name: 'Is ANY water treated?', score: { value: 'yes', units: 'yes-no' } },
        'L.3A.4': { 
          name: 'If yes, how is the water treated and what is the treated water used for?',
          score: { 
            value: 'The dump tank water is treated with chlorine (water is treated in the tank).',
            units: 'text'
          }
        },
        'L.3A.5': { name: 'Is ANY water stored (cistern/tank/container)?', score: { value: 'no', units: 'yes-no' } },
        'L.3A.6': { name: 'If yes, what is stored water used for?', score: { value: '', units: 'text' } },
        'L.3A.7': { name: '# of individual equipment (packinglines, tanks, etc.)', score: { value: '2', units: 'number' } },
        'L.3A.8': { 
          name: '# of individual water sources (e.g., well, municipal, surface, cistern/tank/container, etc.)',
          score: { value: '1', units: 'number' },
        },
        // This is a weird one, because it's an 'N/A' box for a whole subset of supporting points.  For simplicity,
        // let's just make it a yes-no question that represents whether it is n/a (yes) or not (no)
        'L.3A.9': { 
          name: 'Water tests are available showing microbiological quality is appropriate for '
               +'intended use?  (only municipal water is used and it is not stored, treated, '
               +'recycled or used for the final rinse) - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        // And now we'll repeat that model for each of the rows that have an N/A followed by a series of 
        // supporting_points that the n/a is supposed to refer to.
        'L.3A.10': { 
          name: 'Water used to fill/replenish flumes, wash/drench tanks, hydro-coolers, etc. - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.11': {
          name: 'Water used to fill/replenish flumes, wash/drench tanks, hydro-coolers, etc. - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.12': {
          name: 'Water used to fill/replenish flumes, wash/drench tanks, hydro-coolers, etc. - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        // And now repeat that structure for all the rows up to the Cranberries only:
        'L.3A.13': { 
          name: 'Water used to wash melons - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.14': {
          name: 'Water used to wash melons - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.15': {
          name: 'Water used to wash melons - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.16': { 
          name: 'Water used to wash leafy greans - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.17': {
          name: 'Water used to wash leafy greens - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.18': {
          name: 'Water used to wash leafy greens - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.19': { 
          name: 'Water used for flume/wash/drench/ cooling/ hydro-cooling/slush is kept potable - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.20': {
          name: 'Water used for flume/wash/drench/ cooling/ hydro - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.21': {
          name: 'Water used for flume/wash/drench/ cooling/ hydro - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.22': { 
          name: 'Water used for flume/wash/drench/ cooling/ hydro-cooling/slush is kept potable - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.23': {
          name: 'Water used for flume/wash/drench/ cooling/ hydro-cooling/slush is kept potable - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.24': {
          name: 'Water used for flume/wash/drench/ cooling/ hydro-cooling/slush is kept potable - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.25': { 
          name: 'Final Rinse water - N/A',
          score: { value: 'no', units: 'yes-no' },
        },
        'L.3A.26': {
          name: 'Final Rinse water - 1st water test - Prior to initial use',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.27': {
          name: 'Final Rinse water - 2nd water test',
          score: { value: 'yes', units: 'yes-no' },
        },
        // Here is an example of an "N/A" on these sets.  N/A here appears to mean ignore
        // the next three questions:
        'L.3A.28': { 
          name: 'CRANBERRIES ONLY - Final Rinse water after wet harvesting - N/A',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.29': {
          name: 'CRANBERRIES ONLY - Final Rinse water after wet harvesting - 1st water test - Prior to initial use',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.30': {
          name: 'CRANBERRIES ONLY - Final Rinse water after wet harvesting - 2nd water test',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.31': {
          name: 'Processor provides a final rinse confirmed with a letter of assurance '
               +'(FOR CRANBERRIES FOR PROCESSING ONLY)',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.32': { 
          name: 'Chemical application (during packing) water - N/A',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.33': {
          name: 'Chemical application (during packing) water - 1st water test - Prior to initial use',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.34': {
          name: 'Chemical application (during packing) water - 2nd water test',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.35': { 
          name: 'Water used for packaging accessories (e.g., to wet pads/liners) - N/A',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.36': {
          name: 'Water used for packaging accessories (e.g., to wet pads/liners) - 1st water test - Prior to initial use',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.37': {
          name: 'Water used for packaging accessories (e.g., to wet pads/liners) - 2nd water test',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.38': { 
          name: 'Water for humidity/ misting (except for potatoes) - N/A',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.39': {
          name: 'Water for humidity/ misting (except for potatoes) - 1st water test - Prior to initial use',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.40': {
          name: 'Water for humidity/ misting (except for potatoes) - 2nd water test',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.41': { 
          name: 'Water for handwashing - N/A',
          score: { value: 'yes', units: 'yes-no' },
        },
        'L.3A.42': {
          name: 'Water for handwashing - 1st water test - Prior to initial use',
          score: { value: 'n/a', units: 'n/a' },
        },
        'L.3A.43': {
          name: 'Water for handwashing - 2nd water test',
          score: { value: 'n/a', units: 'n/a' },
        },
      },
    },

  }, // end of control_points

}
