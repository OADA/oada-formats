module.exports = {
    name: 'Bob\'s sensor',
    context: {
        'sensor-hub': {
            _id: '93uxjadkjxa7r'
        }
    },
    sensorType: {
        name: 'soil-moisture',
        subType: 'resistive'
    },
    model: '200SS',
    manufacturer: 'Watermark',
    manufacturerId: '9029384093',
    installation: {
        time: 1449328934,
        location: {
            latitude: -40.4893054,
            longitude: 80.90238423
        },
        depth: {
            units: 'm',
            value: '0.3'
        }
    },
    installationHistory: {
        'k0d2fjkl2f3': {
            time: 1449328934,
            location: {
                latitude: -40.4893054,
                longitude: 80.90238423
            },
            depth: {
                units: 'm',
                value: '0.3'
            }
        }
    },
    measurementProperties: {
        units: 'Pa',
        resoltuion: 1.2,
        accuracy: 0.015
    },
    data: {
        'soil-moisture': {
            _id: 'k0jdf2kl3fjl', _rev: '4-kjdtf0i2j3f'
        }
    }
};
