module.exports = {
    dataType: {
        definition: 'https://github.com/oada-formats/tree/master/formats/' +
                    'application/vnd/oada/sensor-data/generic/1/+json',
        name: 'generic'
    },
    context: {
        'timehash-4': 1456370000,
        'sensor-hub': {
            _id: 'xkadu8423aad'
        }
    },
    stats: {
        max: {
            dataKey: 'lsdfj02ifjwlsdoif2j3',
        },
        mean: {
            value: 101325.923843
        },
        std: {
            value: 1.03943
        }
    },
    templates: {
        1: {
            sensor: {
                _id: 'xjxaf83x7xs3'
            },
            units: 'Things',
            location: {
                latitude: -40.9384920342,
                longitude: 80.9308242934,
                altitude: 204.93084234
            }
        },
        2: {
            sensor: {
                _id: 'xjxaf83x7xs3'
            },
            units: 'Things',
            location: {
                _id: '89fa738rkfas'
            }
        },
        '3': {
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
                        value: 'on',
                    },
                    {
                        end: 'Inf',
                        value: 'off',
                    }
                ]
            }
        }
    },
    data: {
        'lsdfj02ifjwlsdoif2j3': {
            template: '1',
            time: 1456376029.293843,
            value: 30.902938
        },
        'd02fijflwlkflfsjkdf': {
            template: '1',
            'time-start': 1456376030.90398423,
            'time-end': 1456376031.90398423,
            max: 101329.90398423,
            mean: 101325.90398423,
            min: 101300.90398423,
            std: 1.8423,
        },
        '20dkfj203jwefjlkfj0293i': {
            template: '2',
            time: 1456376031.90398423,
            value: 31.90398423
        }
    }
};
