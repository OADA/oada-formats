// application/vnd.oada.bookmarks.1+json
module.exports = {
    planting: {
        _id: '09ijfofj',
        _rev: '2-djfh92843hj'
    },
    harvest: {
        _id: '908uf2jh',
        _rev: '33-kdfj092jle'
    },
    machines: {
        _id: '0kdfj20j',
        _rev: '8-kdjs90fj2oi'
    },
    irrigation: {
        _id: '0jk2iopw',
        _rev: '4-d98ohf29efk'
    },
    sales: {
        _id: '0kdfj20j',
        _rev: '99-kdjf92lsdf'
    },
    sensors: {
        _id: 'kd02ufjk',
        _rev: '3-kdsfjoiwefj'
    },
    fields: {
        _id: '0kdfj2jl',
        _rev: '7-kk0all2oald'
    },

    // clients holds info about the integration partner's clients,
    // including which hubs go with which clients.  Expect this to
    // link to a data-index with an unordered "list" key under it,
    // and each client document may either be an organization or
    // a person.  Each of those types of documents can have a "bookmarks"
    // key in them, so when you reach the level that owns a particular
    // sensor-hub, the 'sensor-hubs' key will show up in that bookmarks
    // document.  In other words, if all you're interested are the sensor
    // hubs, just travel down the client/bookmarks graph until you find
    // a bookmarks with a sensor-hub.
    clients: {
        _id: '9sdkf2lk',
        _rev: '4-lfdu029kjds'
    },

    // A "sensor-hub" is a device which would aggregate physical sensors together
    // and act as a gateway to the cloud.
    'sensor-hubs': {
        _id: 'xks84x8s',
        _rev: '1-Rjsuf73fs8d'
    }
};
