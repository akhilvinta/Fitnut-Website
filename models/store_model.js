const mongoose = require('mongoose');

const store_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    zip: Number,
    city: String,
    cost: String,
    link: String,
    desc: String
});

module.exports = mongoose.model('StoreModel', store_schema,'Stores');

