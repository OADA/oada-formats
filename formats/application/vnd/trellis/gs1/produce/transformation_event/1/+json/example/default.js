module.exports = {

  _type: 'application/vnd.trellis.gs1.produce.transformation_event.1+json',
  orginator: '1234567890128',
  trading_partner: '3214567890821',
  activity_type: 'purchase_order',
  orginator_type: 'manufacturer',
  receiver_type: 'distributor',
  timestamp: '08081028123546',
  activity_no: 'ABC-123',
  transformation_input:[
  {
    gtin:'97350053850012',
    batch_or_lot_serial:'234578',
    product_date:'20180513',
    sell_by:'1234567890128',
    quantity:'550',
    
  },
  {
    gtin:'97350053850012',
    batch_or_lot_serial:'234578',
    product_date:'20180513',
    sell_by:'1234567890128',
    quantity:'550',
  },

],
transformation_output:[
  {
    gtin:'78350053850012',
    batch_or_lot_serial:'234578',
    product_date:'20180513',
    sell_by:'1234567890128',
    quantity:'550',
    
  },
  {
    gtin:'67350053850012',
    batch_or_lot_serial:'234578',
    product_date:'20180513',
    sell_by:'1234567890128',
    quantity:'550',
  },

],
  
}
