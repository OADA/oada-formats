module.exports = {
    dataType: {
        definition:
            'https://github.com/oada-formats/tree/master/formats/application/vnd/oada/sensor-data/vibration/1/+json',
        name: 'vibration'
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
            units: '[quantization]',
            quantization: {
                units: 'Hz',
                levels: [
                    {
                        start: '-Inf',
                        end: 25.0,
                        value: 'on'
                    },
                    {
                        end: 'Inf',
                        value: 'off'
                    }
                ]
            }
        }
    },
    data: {
        'lsdfj02ifjwlsdoif2j3': {
            template: '1',
            time: 1456376029.293843,
            value: 'on'
        },
        'd02fijflwlkflfsjkdf': {
            template: '1',
            time: 1456376030.90398423,
            value: 'off'
        },
        'k209j2o3if2jlkwdf02': {
            template: '1',
            time: 1456376031.90398423,
            value: 'on'
        }
    }
}
