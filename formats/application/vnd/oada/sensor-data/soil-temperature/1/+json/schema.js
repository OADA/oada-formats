const libvocab = require('vocabs/oada');
const {vocab,vocabToProperties,patterns,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);


module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-data.soil-temperature.1+json',
  properties: {

// XXX STOPPED HERE...

            templates: {
                patternProperties: {
                    '.': {
                        properties: {
                            units: {
                                type: 'string',
                            },
                            depth: {
                                properties: {
                                    units: {
                                        type: 'string'
                                    },
                                    value: {
                                        type: 'number'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            data: {
                patternProperties: {
                    '.': {
                        properties: {
                            value: {
                                type: 'number'
                            }
                        }
                    }
                }
            }
        }
    }]
});
