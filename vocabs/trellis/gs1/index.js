//---------------------------------------------------------------------------------
// The purpose of "vocab" is to have a bunch of re-usable terms for GS1 data schema
// for produce ( food and vegetables). Below vocab contains terms related for 3
// business event specified in GS1 for produce which are shipping, receiving and
//transformation. Also the terms for a trading item are defined.
//---------------------------------------------------------------------------------


const libvocab = require('../../../lib/vocab')('gs1'); // vocab module is 'gs1'
const { register, enumSchema, vocab, vocabToProperties, override } = libvocab;

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
               ' origin such as grower, supllier, plant/manufacturer, distributor, ' +
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

register('event_location', override('gln', {
  description: 'An event_location is the GLN which should be unique to represent an '+
  ' origin such as grower, supllier, plant/manufacturer, distributor, ' +
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

register('sell_by', override('gln', {
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

register('originator', override('gln', {
  description: 'gln of the data originator and the data owner',
}));

register('trading_partner', override('gln', {
  description: 'gln of the trading partner',
}));

register('activity_type', enumSchema({
  description: 'defines the business process that taking place',
  type: 'string',
  known: ['purchase_order', 'production_work_order','bill_of_landing' ],
}));

register('activity_no', {
  description: 'defines a unique identifer to implicate the transaction id of the business event - purchase order id etc',
  type: 'string'
});

register('trading_partner_type', enumSchema({
  description: 'type of the partner: grower,supplier,manufacturer, processor, distributor, retailor',
  type: 'string',
  known: ['grower', 'supplier','manufacturer','processor','distributor','retailor' ],
}));

register('originator_type', override('trading_partner_type', {
  description: 'trading_partner_type of the originating trading partner',
}));

register('receiver_type', override('trading_partner_type', {
  description: 'trading_partner_type of the receiving trading partner',
}));

register('timestamp', {
  description: 'defines the timestamp of the data capture',
  type: 'string'
});

register('activity_no', {
  description: 'defines a unique identifer to implicate the transaction id of the business event - purchase order id etc',
  type: 'string'
}); 

register('contents_of_receipt', override('trading_items', {
  description: 'all receiving trading items',
}));

register('contents_of_shipment', override('trading_items', {
  description: 'all shipping trading items',
}));

register('receiving_event', {
  description: 'business event of trading party receiving items',
  properties: vocabToProperties([ 
    'originator', 'trading_partner', 'activity_type','originator_type','receiver_type','timestamp',
    'activity_no','contents_of_receipt'
  ])
});

register('shipping_event', {
  description: 'business event of trading party shipping items',
  properties: vocabToProperties([ 
    'originator', 'trading_partner', 'activity_type','originator_type','receiver_type','timestamp',
    'activity_no','contents_of_shipment'
  ])
});

register('transformation_input', override('trading_items', {
  description: 'all input trading items for a transformation',
}));

register('transformation_output', override('trading_items', {
  description: 'all output new trading items after a transformation',
}));

register('transformation_event', {
  description: 'business event of trading party transforming trading items to produce new items=, i.e fresh to frozen',
  properties: vocabToProperties([ 
    'originator', 'trading_partner', 'activity_type','originator_type','receiver_type','timestamp',
    'activity_no','transformation_input','transformation_output'
  ])
});

module.exports = libvocab;
