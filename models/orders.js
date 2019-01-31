const mongoose = require('mongoose');

const orders_schema = mongoose.Schema({
    quote_ids: [{type: mongoose.Schema.Types.ObjectId, ref: 'quotes'}]
    , customer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'admin_customers'}
    , order_details : [{type: mongoose.Schema.Types.Mixed}]
    , customer_po : [
        {
            po_number : String
            , po_received : Date
            , order_status : {type: mongoose.Schema.Types.ObjectId, ref: 'order_statuses'}
            , files : [{type: mongoose.Schema.Types.Mixed}]  //figure out later on how to handle
        }
    ]
    , notes : [
        {
            date : Date
            , user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_users'}
            , note : String
        }
    ]
    , customer_comments : [
        {
            date : Date
            , user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_users'}
            , comment : String
        }
    ]
});

const orders = mongoose.model('orders', orders_schema);
module.exports = orders;
