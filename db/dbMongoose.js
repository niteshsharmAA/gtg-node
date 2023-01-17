const mongoose = require('mongoose')
const logger = require('../logger')
const url = 'mongodb://192.168.0.61:27017/binance_clone'
mongoose.connect(url,{useNewUrlParser : true })
mongoose.set('strictQuery', true)
const dbMongoose = mongoose.connection
dbMongoose.once("open",() => { logger.info("Mongoose Db Connected")})
dbMongoose.on("error",(err) => { logger.info("Mongo Db Connectin error" + err)})