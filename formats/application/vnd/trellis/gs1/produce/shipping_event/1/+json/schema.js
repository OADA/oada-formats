const libvocab = require('vocabs/trellis/gs1');
const {vocab,vocabToProperties} = libvocab;
const { oadaSchema } = require('lib/oada-schema-util.js')(libvocab);

module.exports = oadaSchema({ //reusing OADA schema validation logic
  // gs1 receiving event requires this _type on the schema it produces
  _type: 'application/trellis.vnd.gs1.produce.shipping_event.1+json',

  description:  'GS1 receiving event has certain required fields and and array element',

  properties: vocabToProperties([
    'originator',      // originator is the GLN of the orginating party
    'trading_partner', // trading_partner is the GLN of the trading partner party
    'activity_type',   // activity_type is the business function: 'purchase_order', 'production_work_order','bill_of_landing'
    'originator_type', // originator_type is the type of the orignating trading partner : Manufacturer, Processor, Distributor, Retailor etc
    'receiver_type',   // receiver_type is the type of the receving trading partner : Manufacturer, Processor, Distributor, Retailor etc
    'timestamp',       // timestamp is the date-time of the data capturing 
    'activity_no',     // activity_no is the activity_no of the purchase_order, shipment etc
    'contents_of_shipment' // contents_of_shipment: details of the trading items: each item includes 
                           // 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'
  ])
});
            
