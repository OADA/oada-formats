module.exports = {
    dataType: {
        definition: 'https://github.com/oada-formats/tree/master/formats/application/vnd/oada/sensor-data/soil-moisture/1/+json',
        name: 'soil-moisture'
    },
    context: {
        'timehash-4': 1456370000,
        'sensor-hub': {
            _id: '9f84u9f'
        }
    },
    templates: {
        '1': {
            sensor: {
                _id: 'i02ijf2i3o23'
            },
            'moisture-type': 'potential',
            units: 'Pa',
            depth: {
                units: 'm',
                value: 0.3
            },
            temperature: {
                units: 'Cel',
            }
        },
        '2': {
            sensor: {
                _id: 'f92jlkdfjow'
            },
            'moisture-type': 'gravimetric-content',
            units: '%',
            depth: {
                units: 'm',
                value: 0.9
            }
        },
        '3': {
            sensor: {
                _id: '980239fjkdf2'
            },
            'moisture-type': 'volumetric-content',
            units: 'm3/m3',
            depth: {
                units: 'm',
                value: 1.2
            },
            'soil-temperature': {
                units: 'Cel'
            }
        }
    },
    data: {
        'lsdfj02ifjwlsdoif2j3': {
            template: '1',
            time: 1456376029.293843,
            value: 10.902938
        },
        'd02fijflwlkflfsjkdf': {
            template: '2',
            time: 1456376030.90398423,
            value: 10.90398423
        },
        'k209j2o3if2jlkwdf02': {
            template: '3',
            time: 1456376031.90398423,
            value: 10.90399323,
            'soil-temperature': {
                value: 30.12321
            }
        }
    }
}
