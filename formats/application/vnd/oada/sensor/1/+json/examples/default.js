{
  _id: "92jfik23o3iwe",
  _rev: "1-kdufj02ifj2klfklwef",
  _meta: { _metaid: "92jfik23o3iwe", _rev: "1-kfj029i3jfk2l3" },
  _type: "application/vnd.oada.sensor.1+json",

  // This document represents a description of a particular sensor
  // that may or may not be connected to a sensor hub

  context: {
    // if the sensor is connected to a hub, put a link to the hub here
    'sensor-hub': { _id: '02jkfl2kfjfdl' }, // non-versioned link
  },

  name: "Bob's sensor",

  // Information about the type of sensor and who made it:
  sensorType: {
    name: 'soil-moisture', // an enumerated type, possible values to be populated later.
    subType: 'resistive',
  },
  model: '200SS',
  manufacturer: 'Watermark',
  manufacturerId: '9029384093', // like a serial or VIN number uniquely identifying this sensor

  // Information about how it was installed.  'installation' refers to the 'current'
  // installation, and installationHistory below refers to the current and all previous
  // installations.  There should be an object in installationHistory that is an exact
  // duplicate of the one in 'installation'.
  installation: {
    time: 1449328934, // approximate time the sensor was installed
    location: { // normal OADA location object.  If only lat/lon, assume sensor is stationary.
      latitude: '-40.4893054',
      longitude: '80.90238423',
    },
    depth: { // soil moisture probes have an associated depth of installation
      units: 'm',
      value: '0.3',
    },
  },
  installationHistory: {
    'k0d2fjkl2f3': {
      time: 1449328934,
      location: { // normal OADA location object
        latitude: '-40.4893054',
        longitude: '80.90238423',
      },
      depth: { // soil moisture probes have an associated depth of installation
        units: 'm',
        value: '0.3',
      },
    },
  },

  // Information about the quality of the data being sampled by this
  // sensor:
  measurementProperties: {
    units: 'Pa',
    resolution: 1.2, // using the units above (Pa)
    accuracy: 0.015, // using the units above (Pa)
  },

  // A sensor can link to the data it creates here under 'data', and the data can also link
  // back to the sensor.  In this case, the soil-moisture link is the exact
  // same resource as the soil-moisture link on the hub.  Therefore, after moving through
  // the indexing to reach a document containing sample data, there may be
  // samples from other soil moisture sensors connected to the same hub:
  // to filter, use the _id on this document to find samples only from this
  // sensor.
  //
  // To reiterate, the soil-moisture link below is not guaranteed to be a link 
  // to ONLY this sensor's soil-moisture data.  Other sensors' data may be in 
  // there as well.  It IS guaranteed that all of this particular sensor's data
  // is accessible from that link, among possibly other data.  It is possible
  // to only have this sensor's data there, just not required.
  data: {
    'soil-moisture': { _id: 'k0jdf2kl3fjl', _rev: '4-kjdtf0i2j3f' },
  },

}
