var mongoose = require('mongoose');

var admin_users_schema = mongoose.Schema({
    customer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'admin_customers'},
    username: String,   //!!!! We will run the model based off of this !!!!//
    password: String,
    email: String,
    first_name: String,
    last_name: String,
    phone: {
        mobile : String
        , office : String
        , other : String
    },
    addresses : [
        {
            address_desc : String,
            address_1: String,
            address_2: String,
            city: String,
            state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'geo_states'},
            country_id : {type: mongoose.Schema.Types.ObjectId, ref: 'geo_countries'},
            zip_code: String,
        }
    ],
    email_token : String,
    email_response : [{type: mongoose.Schema.Types.Mixed}],
    email_token_ttl : Date,
    login_failure_count : Number,
    last_login : Date,
    notes : [
        {note_date : Date,}
    ],
    role_id : [{type: mongoose.Schema.Types.ObjectId, ref: 'admin_user_roles'}],
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

var admin_users = mongoose.model('admin_users', admin_users_schema);
module.exports = admin_users;

