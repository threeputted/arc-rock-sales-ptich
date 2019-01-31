const mongoose = require('mongoose');

const order_statuses_schema = mongoose.Schema({
    status: String
});

const order_statuses = mongoose.model('order_statuses', order_statuses_schema);
module.exports = order_statuses;
