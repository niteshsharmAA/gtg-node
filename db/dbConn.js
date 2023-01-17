// global imports
const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    operatorsAliases: 0,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 30000
    },
    logging: false
});