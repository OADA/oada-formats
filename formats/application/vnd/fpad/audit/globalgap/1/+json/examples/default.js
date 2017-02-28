module.exports = {
  _type: 'application/vnd.fpad.audit.globalgap.1+json',

  // certificationid identifies a particular chain of documents that culinates
  // in a certification if successful.  All documents in the chain (audit, corrective
  // actions, certificate) will have the same certificationid.
  certificationid: {
    id_source: 'scheme',    // source for this ID is the scheme owner described elsewhere
    id: '12345-AAAAA-6789', // in this audit (global gap in this case)
  },
  
  // scheme: info about the type of audit
  scheme: {
    name: "GLOBALG.A.P.", // Does GFSI maintain a list of strings which would be valid here?
    version: "5.0-1",
    option: "1",
    modules: [
      { name: 'All Farm Base' },
      { name: 'Crops Base' },
      { name: 'Fruit and Vegetables' },
    ],
  },
  
  // certifying body: info about who performed the audit
  certifying_body: { 
    name: "SCS Global Services",
    auditor: { name: "Aaron Auditor Ault" },  
  },

  // Organization contains information about the party being audited.
  organization: {
    organizationid: {
      id_source: "scheme", // the certifying body already described in this document
      id: "777777777",     // This is the GLOBALG.A.P Number for this organization
      otherids: [
          { id_source: 'certifying_body', id: '1234567' },
      ],
    }, 
    name: "Noel Produce Masters",
    contacts: [ { name: "Sam Noel" } ],
    location: {
      description: "(All sites in same area), Pesticide storage"
      street_address: "44641 SW Plumlee Rd.",
      city: "Nowhere",
      state: "Florida",
      country: "USA",
    },
  },

  // Scope: what sorts of things does this audit cover (operation, products, etc.)  
  scope: {
    notification: 'announced', //or 'unannounced'
    description: '',
    operations: [
      { name: 'handling' }, // if handling is "no", then don't include it in the array
    ],
    
    // Called "Crops audited" in global gap, but same as "products_observed" in primus
    // At this level, it should refer to all crops that have any operation audited.
    // Then if any one of the operations only has a subset of the total crops
    // (for example, if harvest is only audited for one crop and not the others),
    // then the particular operation above will have the same "products_observed" key,
    // but it will only have the names of the products that have harvest included.
    //
    products_observed: [ { 
      name: "Blueberries",
      first_area: { value: 70, units: "acres" },
      further_area: { value: 10.67, units: 'acres' },
      operations: [ 
        { name: 'growing', covering_type: 'uncovered', }
        { name: 'harvest' }   // if harvest is excluded, then don't include it in the array
      ],
    }],
    
    similar_products_not_observed: [{
      name: "Snozzberries",
    }],
    
    production_sites: [
      { 
        name: 'The Big Ranch', 
      id: '1234', 
      products_observed: [ { 
          name: "Blueberries",
          organic: true,
          area: { value: 70, units: "acres" },
          location: {
            description: '', //any accompanying text description; often used to supply directions
            city: '',
          },
        }],
      },
    ],
    
    parallel_production: false, // optional, true/false
    parallel_ownership: false,  // optional, true/false
  },

  conditions_during_audit: {
    // what should we call it if there is just a single "audit date"?
    operation_observed_date: "2016-07-26",
    duration: { value: 4.5, units: "hours", },
  },

  score: {
    is_compliant: false, // because in this example, major_musts.is_compliant is false
    // If there is a total score, you can put value and units under score directly.
    // If there is a preliminary/final score, put them under preliminary/final
    globalgap_levels: {
      major_musts: {
        yes: { value: '12', units: 'count' },
         no: { value:  '1', units: 'count' },
        n_a: { value: '32', units: 'count' },
        is_compliant: false,
      },
      minor_musts: {
        yes: { value: '12', units: 'count' },
         no: { value:  '1', units: 'count' },
        n_a: { value: '32', units: 'count' },
        value: '98.72', units: '%',
        is_compliant: true,
      },
    },
  },

//A summary of failed questions and corrective actions are reported on the last page.
  
  sections: [
    { 
      sectionid: 'AF',
      name: "All Farm Base",
      sections: [
        {
          sectionid: 'AF 1',
          name: "Site History and Site Management",
          sections: [
            {
              sectionid: 'AF 1.1',
              name: "Site History",
              control_pointids: [ 'AF 1.1.1', 'AF 1.1.2' ],
            }, {
              sectionid: 'AF 1.2',
              name: "Site Management",
              control_pointids: [ 'AF 1.2.1', 'AF 1.2.2' ],
            },
          ],
        },{
// !!! Note the variable section depth.
          sectionid: 'AF 2',
          name: "Record Keeping And Internal Self-Assessment/Internal Inspection",
          control_pointids: [ 'AF 2.1', 'AF 2.2', 'AF 2.3' ],
        },
      ],
    },
  },
  
  control_points: {
    'AF 1.1.1': {
      question_name: "Is there a reference system for each field, orchard, greenhouse, yard, plot, livestock building/pen, and/or other area/location used in production?",
      criteria: [ 'A physical sign at each field/orchard, greenhouse/yard/plot/livestock building/pen, or other farm area/location', 
        'A farm map, which also identifies the location of water sources, storage/handling facilities, ponds, stables, etc. and that could be cross-referenced to the identification system.', 
      ],
      globalgap_level: 'major_must'
      score: {
        value: 'yes',
        units: 'yes-no-n_a',
      },
      justification: "Site map was available for review. Broken down by Field ID. Variety and acreage is listed on legend indicating which applies to each block. Fuel and drip water line indicated on map.",
    },
  },
}
