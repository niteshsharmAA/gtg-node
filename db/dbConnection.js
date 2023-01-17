const { Client } = require('pg')
const logger = require('../logger');
const dotenv = require('dotenv')
dotenv.config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

client.connect(function(err) {
    if (err) throw err;
    logger.info("Connected");
  });


module.exports = client


