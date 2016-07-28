module.exports = {
    dataType: {
        definition: 'https://github.com/oada-formats/tree/master/formats/application/vnd/oada/sensor-data/rainfall/1/+json',
        name: 'rainfall'
    },
    context: {
        'timehash-4': 1456370000,
        'sensor-hub': {
            _id: '9f84u9f'
        }
    },
    templates: {
        1: {
            sensor: {
                _id: 'i02ijf2i3o23'
            },
            units: 'm',
            rate: {
                units: 'm/s'
            }
        }
    },
    data: {
        'lsdfj02ifjwlsdoif2j3': {
            template: '1',
            'time-start': 1456376029.293843,
            'time-end': 1456376030.293843,
            value: 0.0834,
            rate: {
                max: 10.902938
            },
            freezing: true
        }
    }
}
