const mongoose = require('mongoose');

const geo_countries_schema = mongoose.Schema({
    country_name: String
    , country_name_short: String
    , states : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_states'}]
    , provinces : [{type: mongoose.Schema.Types.ObjectId, ref: 'geo_provinces'}]
});

const geo_countries = mongoose.model('geo_countries', geo_countries_schema);
module.exports = geo_countries;
