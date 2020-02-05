var libvocab = require('../../lib/vocab')('oada');

// Only importing the essentials, more complext definitions may need more imports
// similar to the main oada index.js this is based off of
const {register,  override} = libvocab;

// Custom location schema
register('lat', override('latitude', {
    description: 'Short form of latitude term, otherwise the same. ' +
                 'Used in ISOBlue CAN data.'
}));
  
register('lng', override('longitude', {
    description: 'Short form of longitude term, otherwise the same. ' +
                 'Used in ISOBlue CAN data.'
}));


// Custom CAN schema
register('is_error_frame', override('generic-data-value', {
    description: 'Error frame flag for can frame',
    type: Boolean,
}));

register('is_extended_frame', override('generic-data-value', {
    description: 'Extended fram flag for can frame',
    type: Boolean,
}));

register('arbitration_id', override('generic-data-value', {
    description: 'CAN ID portion of extended can frame',
    type: Number,
}));

register('dlc', override('generic-data-value', {
    description: 'Data Length Code portion of extended can frame',
    type: Number,
}));

register('payload', override('generic-data-value', {
    description: 'String representaiton can frame payload in hexadecimal',
    type: String,
}));

register('is_remote_frame', override('generic-data-value', {
    description: 'Remote frame flag from can frame',
    type: Boolean,
}));

// Custom heartbeat schema
register('backlog', override('generic-data-value', {
    description: "Length of backlog in computer systems. Used in Isoblue"+
                 " to send amount of unsent messages",
    type: Number,
}));

register('netled', override('led-status', {
    description: "Network health status LED",
}));

register('statled', override('led-status', {
    description: "General health status LED",
    type: Boolean,
}));

// Rename to celluar-sp?
register('cell_ns', override('network-strength', {
    description: 'Strength of celluar signal, ranging from ~-100 to ~-10',
}));
  
//Rename to wifi-sp?
register('wifi_ns', override('network-strength', {
    description: "Strength of wifi signal, ranging form ~-100 to ~-10",
}));