const mongoose = require('mongoose')

const customerMongoose = mongoose.Schema({
    name : { type : String },
    age : { type : Number },
    dob : { type : String },

},{timestamps : true})

module.exports = mongoose.model('customer',customerMongoose)