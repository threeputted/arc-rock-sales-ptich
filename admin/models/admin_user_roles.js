var mongoose = require('mongoose');

// This model has the basic customer information
var user_roles_schema = mongoose.Schema({
    role : String
});
var admin_user_roles = mongoose.model('admin_user_roles', user_roles_schema);
module.exports = admin_user_roles;