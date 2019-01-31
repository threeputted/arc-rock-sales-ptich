const mongoose = require('mongoose');

const quotes_schema = mongoose.Schema({
    customer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'admin_customers'}
    , project_number : String   //from teamwork
    , quote_number : String  //bls number ??
    , quote_description : String
    , quote_dates : {
        received_date : Date
        , delivered_date : Date
    }
    , quote_details : [{type: mongoose.Schema.Types.Mixed}]
    , file_attachments : [
        {
            description: String
            , url : String
            , upload_date : String
            , status_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_statuses'}
        }
    ],
    creation_date : Date,
    status_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_statuses'},
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_users'},
    updates : [
        {
            update_date : Date,
            user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'admin_users'},
            changes : {type: mongoose.Schema.Types.Mixed},
        }
    ]

});

const quotes = mongoose.model('quotes', quotes_schema);
module.exports = quotes;
