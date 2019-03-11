//---------------------------------------------------------------------------------
// The purpose of "vocab" is to have a bunch of re-usable terms for GS1 data schema
// for produce ( food and vegetables). Below vocab contains terms related for 3
// business event specified in GS1 for produce which are shipping, receiving and
//transformation. Also the terms for a trading item are defined.
//---------------------------------------------------------------------------------


var _ = require('lodash');
var libvocab = require('../../../lib/vocab')('gs1'); // vocab module is 'gs1'
var register = libvocab.register;
var enumSchema = libvocab.enumSchema;
var vocab = libvocab.vocab;
var sameAs = libvocab.sameAs;

// Note that the 'vocab()' function is what this module exports.  It is
// defined in libvocab, and is how you should interact with the vocab built
// here.

//----------------------------------------------------------------------------
// Identifiers
//----------------------------------------------------------------------------

register('id', { 
  description: 'An id is a string which should be unique to represent the '+
               ' object it belongs to.',
  type: 'string',
});

register('event_location', { 
  description: 'An event_location is the GLN which should be unique to represent an '+
               ' origin such as growser, supllier, plant/manufacturer, distributor, ' +
               ' or a retailor',
  type: 'string',
});

register('gtin', { 
  description: 'A gtin is a string which should be unique to represent a '+
               ' trading item ( raw materials to processor/manufacturer, products from manufacturer to distributor etc' ,
  type: 'string',
});

register('gln', { 
  description: 'A gln is a string which should be unique to represent a '+
               ' trading item ( raw materials to processor/manufacturer, products from manufacturer to distributor etc' ,
  type: 'string',
});

register('event_location', sameAs('gln', {
  description: 'An event_location is the GLN which should be unique to represent an '+
  ' origin such as growser, supllier, plant/manufacturer, distributor, ' +
  ' or a retailor',
}));

register('sscc', { 
  description: 'An sscc is a string which should be unique to represent a '+
               ' container code of the container in which trading items are loaded' ,
  type: 'string',
});


//----------------------------------------------------------------------------
// trading item info:
//----------------------------------------------------------------------------

register('batch_or_lot_serial', {
  description: 'used to identify the batch/lot the item belongs to',
  type: 'string',
});

register('product_date', {
  description: 'date of finalization',
  type: 'string'
});

register('sell_by', sameAs('gln', {
  description: 'orginating gln',
}));

register('quantity', {
  description: 'no of units',
  type: 'string',
});

register('unit_of_measure', {
  description: 'measuring units',
  type: 'string',
});

register('trading_item', {
  description: 'item is sold/shipped by one trading partner to the other',
  propertySchema: enumSchema([ 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'])
});

register('trading_items', {
  description: 'is a list of trading items being shipped/sold ',
  type: 'array',
  items: vocab('trading_item'),
});

// business event related data:

register('orginator', sameAs('gln', {
  description: 'gln of the data orginator and the data owner',
}));

register('trading_partner', sameAs('gln', {
  description: 'gln of the trading partner',
}));

register('activity_type', {
  description: 'defines the business process that taking place',
  type: 'string',
  value: enumSchema(['purchase_order', 'production_work_order','bill_of_landing' ]),
});

register('activity_no', {
  description: 'defines a unique identifer to implicated the transaction id of the business event - purchase order id etc',
  type: 'string'
});

register('trading_partner_type', {
  description: 'type of the partner: grower,supplier,manufacturer, processor, distributor, retailor',
  type: 'string',
  value: enumSchema(['grower', 'supplier','manufacturer','processor','distributor','retailor' ]),
});

register('orginator_type', sameAs('trading_partner_type', {
  description: 'trading_partner_type of the originating trading partner',
}));

register('receiver_type', sameAs('trading_partner_type', {
  description: 'trading_partner_type of the receiving trading partner',
}));

register('timestamp', {
  description: 'defines the timestamp of the data capture',
  type: 'string'
});

register('activity_no', {
  description: 'defines a unique identifer to implicated the transaction id of the business event - purchase order id etc',
  type: 'string'
}); 

register('contents_of_receipt', sameAs('trading_items', {
  description: 'all receiving trading items',
}));

register('contents_of_shipment', sameAs('trading_items', {
  description: 'all shipping trading items',
}));

register('receiving_event', {
  description: 'business event of trading party receiving items',
  propertySchema: enumSchema([ 'orginator', 'trading_partner', 'activity_type','orginator_type','receiver_type','timestamp',
                              'activity_no','contents_of_receipt'])
});

register('shipping_event', {
  description: 'business event of trading party shipping items',
  propertySchema: enumSchema([ 'orginator', 'trading_partner', 'activity_type','orginator_type','receiver_type','timestamp',
                              'activity_no','contents_of_shipment'])
});

register('transformation_input', sameAs('trading_items', {
  description: 'all input trading items for a transformation',
}));

register('transformation_output', sameAs('trading_items', {
  description: 'all output new trading items after a transformation',
}));

register('transformation_event', {
  description: 'business event of trading party transforming trading items to produce new items=, i.e fresh to frozen',
  propertySchema: enumSchema([ 'orginator', 'trading_partner', 'activity_type','orginator_type','receiver_type','timestamp',
                              'activity_no','transformation_input','transformation_output'])
});

vocab.enumSchema = enumSchema; // oadaSchema function needs access to enumSchema
module.exports = vocab;
