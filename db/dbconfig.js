const { Client } = require('pg')
// const dotenv = require('dotenv')
const logger = require('../logger');
require ('custom-env').env(process.env.APP_ENV);
// dotenv.config();
logger.info("CUSTOME::::",process.env.APP_ENV);
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
