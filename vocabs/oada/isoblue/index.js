var libvocab = require('../../../lib/vocab')('oada');
// Only importing the essentials, more complex definitions may need more imports
// similar to the main oada index.js this is based off of
const {register, override, enumSchema} = libvocab;

// Custom CAN schema
register('is_error_frame',  {
    description: 'Error frame flag for can frame',
    type: Boolean,
});

register('is_extended_frame', {
    description: 'Extended frame flag for can frame',
    type: Boolean,
});

register('arbitration_id', {
    description: 'CAN ID portion of extended can frame',
    type: Number,
});

register('dlc',  {
    description: 'Data Length Code portion of extended can frame',
    type: Number,
});

register('payload', {
    description: 'String representation can frame payload in base64',
    type: String,
});

register('is_remote_frame', {
    description: 'Remote frame flag from can frame',
    type: Boolean,
});

// Custom heartbeat schema
register('backlog', override('generic-data-value', {
    description: "Length of backlog in computer systems. Used in ISOBlue"+
                 " to count the number of unsent messages",
    properties: {
        'units': enumSchema( [ 'count' ] ),
    },
}));

register('netled', override('led-status', {
    description: "Network health status LED",
}));

register('statled', override('led-status', {
    description: "General health status LED",
}));

register('cell_ns', override('network-strength', {
    description: 'Strength of cellular signal, ranging from ~-100 to ~-10',
}));

register('wifi_ns', override('network-strength', {
    description: "Strength of wifi signal, ranging form ~-100 to ~-10",
}));