const libvocab = require('vocabs/oada');
const {vocabToProperties,link} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);


module.exports = oadaSchema({
  _type: 'application/vnd.oada.sensor-hub.1+json',

  properties: vocabToProperties([
    // Things about the sensor hub:
    'name', 'location', 'sensors', 
  ], {
    // Kinds of data records available (linked from here):
        'air-temperature': link(['application/vnd.oada.sensor-data.air-temperature']),
          'soil-moisture': link(['application/vnd.oada.sensor-data.soil-moisture']),
       'soil-temperature': link(['application/vnd.oada.sensor-data.soil-temperature']),
    'barometric-pressure': link(['application/vnd.oada.sensor-data.barometric-pressure']),
              'dew-point': link(['application/vnd.oada.sensor-data.dew-point']),
      'relative-humidity': link(['application/vnd.oada.sensor-data.relative-humidity']),
             'wind-speed': link(['application/vnd.oada.sensor-data.wind-speed']),
         'wind-direction': link(['application/vnd.oada.sensor-data.wind-direction']),
            'cloud-cover': link(['application/vnd.oada.sensor-data.cloud-cover']),
               'rainfall': link(['application/vnd.oada.sensor-data.rainfall']),
        'solar-radiation': link(['application/vnd.oada.sensor-data.solar-radiation']),
             'vibrations': link(['application/vnd.oada.sensor-data.vibration']),
  }),
});
