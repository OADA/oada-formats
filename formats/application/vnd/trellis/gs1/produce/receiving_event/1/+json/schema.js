var schemaUtil = require('../../../../../../../../../lib/schema-util');
var      vocab = require('../../../../../../../../../vocabs/trellis/gs1');

var restrictItemsTo = schemaUtil.restrictItemsTo;
var vocabTermsToSchema = schemaUtil.vocabTermsToSchema;
var requireValue = schemaUtil.requireValue;

module.exports = schemaUtil.oadaSchema({ //reusing OADA schema validation logic
  description:  
  
'GS1 receiving event has certain required fields and and array element',


  properties: {
    // gs1 receiving event requires this _type on the schema it produces
    _type: 'application/vnd.trellis.gs1.produce.receiving_event.1+json',

    // originator is the GLN of the orginating party
    originator: vocab('originator'),
     
    // originator is the GLN of the orginating party
    trading_partner: vocab('trading_partner'),

    // activity_type is the business function: purchase_order', 'production_work_order','bill_of_landing'
    activity_type: vocab('activity_type'),

    // originator_type is the type of the orignating trading partner : Manufacturer, Processor, Distributor, Retailor etc
    originator_type: vocab('originator_type'),

    // receiver_type is the type of the receving trading partner : Manufacturer, Processor, Distributor, Retailor etc
    receiver_type: vocab('receiver_type'),

    // timestamp is the date-time of the data capturing 
    timestamp: vocab('timestamp'),
  
    // activity_no is the activity_no of the purchase_order, shipment etc
    activity_no: vocab('activity_no'),

    // contents_of_receipt: details of the trading items: each item includs 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'
    contents_of_receipt: vocab('contents_of_receipt',{
      required: [ 'gtin', 'batch_or_lot_serial', 'product_date','sell_by','quantity','unit_of_measure'],
      additionalProperties: false,
    },)
  },
});
            
