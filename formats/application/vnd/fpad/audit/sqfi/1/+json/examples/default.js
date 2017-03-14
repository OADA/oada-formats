module.exports = {

  _type: 'application/vnd.fpad.audit.sqfi.1+json',

  certificationid: {
    id_source: 'certifying_body',
    id: '12345',
  }

  scheme: {
    name: "SQFI",
    edition: "7.2",
    level: "3",
    audit_reference_number: "12345",
  }

  certifying_body: {
    name: "NSF Food Safety Certification, LLC",
    auditor: { name: "Aaron Auditor Ault" },
    phone: "8888888888",
    location: {
      country: "United States",
    },
    secondary_auditors: [],
  },

  organization: {
    organizationid: {
      source: "certifying_body",
      id: "123456",
    },
    name: "Noel Produce Masters",
    companyid: "123456",
    location: {
      address: "123 Nonexistent Street",
      city: "Nowhere",
      state: "Florida",
      postal_code: "00000",
      country: "United States",
    },
  },

  scope: {
    description: "RTE cut and peeled carrots, fresh whole topped carrots",
    operation: {
      operation_type: 'facility',
    },
    products_observed: [
      { name: "Carrots", condition: "RTE cut and peeled" },
      { name: "Carrots", condition: "fresh whole topped" }
    ]
  },

  conditions_during_audit: {
    // The following was derived following PGFS format
    operation_observed_date: {
      start: "2015-04-01T08:00:00Z-05:00",
      end: "2015-04-01T12:00:00Z-05:00",
    },
  },

  score: {
    status: "Completed",
    rating: "F - Fails to comply",
    final: {
      value: 20,
      units: "points"
    },
  },

  sections: [
    {
      sectionid: '2',
      name: "Recertification Facility Audit Ed. 7.2 Module 2(3)",
      sections: [
        {
          sectionid: '2.9',
          name: '', //not specified
          sections: [
            {
              sectionid: '2.9.3',
              name: "Instructions Ed. 7.2",
              control_pointids: [ '2.9.3.1' ],
            }, {
              sectionid: '2.9.4',
              name: "HACCP Training Requirement Ed. 7.2",
              control_pointids: [ '2.9.4.1' ],
            },
          ],
        },
      ],
    }, {
      sectionid: '11',
      name: "Recertification Facility Audit Ed. 7.2 Module 11(3)",
      sections: [
        {
          sectionid: '11.1',
          name: '', //not specified
          sections: [
            {
              sectionid: '11.1.1',
              name: "Premesis Location",
              control_pointids: [ '11.1.1.1', '11.1.1.2' ],
            }, {
              sectionid: '11.1.2',
              name: "Construction and Operational Approval Ed. 7.2",
              control_pointids: [ '11.1.2.1' ],
            },
          ],
        },
      ],
    },
  ],

  control_points: {
    '2.9.3.1': {
      name: "Records of all validation activities shall be maintained.",
      score: {
        compliance: {
          value: "Compliant",
          units: "enum-sqfi-compliance",
        },
      },
      auditor_comments: "Record of validation activities are maintained by the quality group. Validations for year 2014-2015 were reviewed.",
    },

    '2.9.4.1': {
      name: "A verification schedule outlining the verification activities, their frequency of completion and the person responsible for each activity shall be prepared and implemented.",
      score: {
        compliance: {
          value: "Compliant",
          units: "enum-sqfi-compliance",
        },
      },
      auditor_comments: "The facility has a schedule Quality Assurance Yearly Task Calendar. All the verification and validation activities have an activity/method how to perform the action, frequency and the responsibility of personnel that performs the actions. These methods are documented within the procedures.",
    },
  },
}
