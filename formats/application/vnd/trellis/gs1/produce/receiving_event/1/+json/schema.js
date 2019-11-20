const libvocab = require('vocabs/trellis/gs1');
const {vocab,vocabToProperties,override} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({ //reusing OADA schema validation logic
  // gs1 receiving event requires this _type on the schema it produces
  _type: 'application/vnd.trellis.gs1.produce.receiving_event.1+json',
  description:  'GS1 receiving event has certain required fields and and array element',

  properties: vocabToProperties([

    // originator is the GLN of the orginating party
    'originator',
     
    // trading_partner is the GLN of the receiving party
    'trading_partner',

    // activity_type is the business function: purchase_order', 'production_work_order','bill_of_landing'
    'activity_type',

    // originator_type is the type of the orignating trading partner : Manufacturer, Processor, Distributor, Retailor etc
    'originator_type',

    // receiver_type is the type of the receving trading partner : Manufacturer, Processor, Distributor, Retailor etc
    'receiver_type',

    // timestamp is the date-time of the data capturing 
    'timestamp',
  
    // activity_no is the activity_no of the purchase_order, shipment etc
    'activity_no',
  ], {

    // contents_of_receipt: details of the trading items: each item includs 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'
    contents_of_receipt: override('contents_of_receipt', {
      required: [ 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'],
      additionalProperties: false,
    }),

  }),

});
            
