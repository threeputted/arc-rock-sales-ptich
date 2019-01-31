var mongoose = require('mongoose');

// This model has the basic customer information
var statuses_schema = mongoose.Schema({
    status : String,
});
var admin_statuses = mongoose.model('admin_statuses', statuses_schema);
module.exports = admin_statuses;