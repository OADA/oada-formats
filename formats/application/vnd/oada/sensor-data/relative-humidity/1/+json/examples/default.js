module.exports = {
    dataType: {
        definition: 'https://github.com/oada-formats/tree/master/formats/' +
                    'application/vnd/oada/sensor-data/relative-humidity/' +
                    '1/+json',
        name: 'relative-humidity'
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
            units: '%',
            location: {
                latitude: -40.9384920342,
                longitude: 80.9308242934,
                altitude: 204.93084234
            }
        }
    },
    data: {
        'lsdfj02ifjwlsdoif2j3': {
            template: '1',
            time: 1456376029.293843,
            value: 101325.902938
        },
        'd02fijflwlkflfsjkdf': {
            template: '1',
            time: 1456376030.90398423,
            value: 101325.90398423
        },
        '09ij2kfjwlkefj203ijwlkf': {
            template: '1',
            time: 1456376031.90398423,
            value: 101325.90398423
        }
    }
};
