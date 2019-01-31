const mongoose = require('mongoose');

let admin_customers_schema = mongoose.Schema({
    name : String,
    website : String,
    notes : String,
    addresses : [{
        address_desc : String,
        address_1 : String,
        address_2 : String,
        city : String,
        state_id : {type: mongoose.Schema.Types.ObjectId, ref: 'geo_states'},
        zip_code : String,
        country_id : {type: mongoose.Schema.Types.ObjectId, ref: 'geo_countries'},
        //phone_main : String,
        //phone_other : String,
        //fax : String,
        //email_general : String,
        //email_sales : String,
        //email_customer_support : String
    }],
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

let admin_customers = mongoose.model('admin_customers', admin_customers_schema);
module.exports = admin_customers;


