var mongoose = require('mongoose');

var geo_states_schema = mongoose.Schema({
    state_name: String    // Alabama, West Virginia
    , state_abb: String     // AL, WV, TX
    , counties: {type: mongoose.Schema.Types.ObjectId, ref: 'geo_counties'}
    , country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'geo_countries'}
});

var geo_states = mongoose.model('geo_states', geo_states_schema);
module.exports = geo_states;
