module.exports = {
  _id: 'd0f2hfhhf9qh23233',
  _rev: '4-kdjf02if32jof3l',
  _meta: { _metaid: 'd0f2hfhhf9qh23233', _rev: '2-dkfj023if2jfjwlf' },
  _type: 'application/vnd.oada.sensor-data.generic.1+json',

  // Pretty much every key in this document is optional.

  // All sensor-data inherited documents will have a 'dataType' key describing
  // the data it contains (in this example case, barometric pressure).  The
  // list of possible "name"s should be found at the definition
  dataType: {
    definition: 'https://github.com/oada-formats', // fill this in eventually
    name: 'barometric-pressure'
  },

  // If this document has outer context about which samples are included in it,
  // that goes under 'context'.  Valid keys for 'context' are anything that
  // can be used to index data.  In the case of data under a sensor-hub organized 
  // by timehash-4, it is indexed both by the sensor hub which reported the
  // data and by the particular timehash that the data belongs to.
  context: {
    'timehash-4': 1456370000,
    'sensor-hub': { _id: '9f84u9f' },
  },

  // If there are aggregate statistics to be reported about this group of data,
  // put the aggregates under 'stats'
  stats: {
    max: {
      dataKey: 'lsdfj02ifjwlsdoif2j3', // the max occurs at this key in 'data'
    },
    mean: {
      value: 101325.923843,
    },
    std: {
      value: 1.03943,
    },
  },

  // 'templates' allows you to define a set of 'default' sample formats that you
  // can refer to in the data itself.  For example, if most of your samples come 
  // from the same sensor, define a template with a link to that sensor and then
  // just refer to that template's key in the sensor data.  This avoids needing
  // to duplicate information in the core data (like units, etc.) unnecessarily.
  // The correct "sample" is therefore a merge between it's template object
  // and the sample object, and where there are conflicting keys, the sample object
  // overrides the template.  Basically standard inheritance.
  templates: {
    '1': { // the key here can be any string, the use of '1' is arbitrary
      // sensor is a link to info about the sensor which generated this data
      sensor: { _id: 'i02ijf2i3o23' }, // Note this is intentionally a non-versioned link so that
                                       // updates to sensor information don't update the _rev's on
                                       // all the underlying sample documents
      units: 'Pa', // All units are from the Universal Code for Units of Measure unitsofmeasure.org/ucum.html

      // If the sensor is stationary for this window, put location in the template so all 
      // samples inherit it
      location: {
         latitude: -40.9384920342,
         longitude: 80.9308242934,
         altitude: 204.93084234,
         // a 'location' can also include a 'geojson' key to represent complex locations
      },
    },
    '2': {
      sensor: { _id: 'i02ijf2i3o23' },
      units: 'Pa',
      // Here is an example of location as a (possibly) indexed stream of recorded points 
      // rather than a single point or polygon.  The primary use case for this is where
      // the sensor itself is attached to a sensor platform with other sensors, and they
      // all share the same location stream that is reported by the sensor hub or with the
      // sensor itself.  Any data below identified with template '2' can link to the 
      // time series location data of the sensor hub platform directly, and this means
      // anyone trying to reconstruct the location of these data points over time can
      // pull that time stream and match it up with the points in this sensor data document.  
      location: { _id: '902jfkelfj23io' },
    },
    '3': {
      sensor: { _id: 'i02ijf2i3o23' },
      // units of '[quantization]' use the brackets to be compatible with UCUM.
      // '[quantization]' means the values are quantized into levels.  The
      // range of values which maps to each level is defined here.
      units: '[quantization]',
      quantization: {
        units: 'Hz',
        // This example has two levels:
        // ( -Inf, 25.0 ] -> 'on' 
        // (2.5.0, Inf) -> 'off'
        // which could mean something like "vibration indicates the machine is on vs. off"
        levels: [
          {
            start: '-Inf',
            end: 25.0,
            value: 'on', // could be true/false, "low"/"medium"/"high", anything you want
          },
          {
            // lack of 'start' key implies this level picks up where previous left off
            end: 'Inf',
            value: 'off',
          },
        ],
      },
    },
  },

  // Notes on location:
  // The location for these data samples can be recorded in multiple places, depending
  // on what makes the most sense for the situation.  Possibilities are:
  // - in each data point below: do this if the location changes relatively frequently and is unique
  //   to this particular type of data.
  // - in the templates above as a single point or polygon: do this if the location changes 
  //   infrequently, but it does change
  // - in a linked location stream document given in the templates above (see template '2' for
  //   an example).  If a time-stamped location stream already exists for multiple sensors,
  //   the stream can be listed with the sensor or sensor hub as it's own generic data set,
  //   and the template here can link to it.  This means that the timestamps on the sensor
  //   data below should be used to align the sensor data with the timestamped stream of 
  //   locations.
  //
  // The rule for which location wins if there are multiple possibilities is the most specific
  // location always wins.  The order of importance is therefore (from most to least important):
  // data sample itself -> template for data sample as lat/lon/alt -> template for data sample 
  // as geojson -> template for data sample as an indexable timestamped location stream.

  data: {
    // The keys under 'data' are simply unique identifiers for each sample.
    // They can be anything that is unique within the dataset in this file.
    // The data in this list is not required to be in any particular order.
    'lsdfj02ifjwlsdoif2j3': {
      id: 'lsdfj02ifjwlsdoif2j3', // a unique string representing this particular sample.
                                  // note that this differs from the '_id' for links/resources.
                                  // If this sample has an id, and it shows up in another indexing schema,
                                  // it will have the same id there as well.  Makes it simpler to 
                                  // sync over time.
      template: '1', // this sample shares the keys that template '1' has
      // All times are UTC unix timestamps with optional fractional seconds,
      // represented as a numeric string
      time: 1456376029.293843, 
      // the precise form of "value" is determined by the data type.  In this
      // example of barometric-pressure, values are numeric strings.
      value: 101325.902938,
    },
    // in the absence of 'time', 'time-start' is used for timehash indexing:
    'd02fijflwlkflfsjkdf': {
      id: 'd02fijflwlkflfsjkdf',
      template: '1',
      // use time-start and time-end for windows of time
      'time-start': 1456376030.90398423,
      'time-end': 1456376031.90398423,
      // for time windows, instead of value, you can use stat names:
      max: 101329.90398423,
      mean: 101325.90398423,
      min: 101300.90398423,
      std: 1.8423,
    },
    '29031lkj02930jdslkf': {
      id: '29031lkj02930jdslkf',
      template: '2', // using template 2 above means the timestamp in this sample is used
                     // to construct a location for this sample from a time series of GPS coordinates.
      time: 1456376031.90398423,
      value: 101325.90398423,
    },
  },

}
