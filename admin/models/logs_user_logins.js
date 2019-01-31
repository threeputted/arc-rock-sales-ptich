var mongoose = require('mongoose');

// This keeps a log for each login attempt with the remote IP and other necessary info
// uses the username instead of an ID for instances where a login attempt
// provides an invalid user name.
var logs_user_logins_schema = mongoose.Schema({
    username : { type: String, required: true }
    , login_successful : {type: Boolean, required: true}   // This can either be true  || false
    , remote_ip : {type: String, required: true}
    , remote_agent : String
    , login_timestamp : Date
});

var logs_user_logins = mongoose.model('logs_user_logins', logs_user_logins_schema);
module.exports = logs_user_logins;
