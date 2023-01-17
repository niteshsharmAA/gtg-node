const res = require('express/lib/response');
const dbConnection = require('../db/dbconfig')

  const dbData = async(req,response) => {
    try {
        const res = await dbConnection.query('SELECT * FROM customer')
        const fields = res.fields.map(field => field.name);
        const data = res.rows
        dbConnection.end()
        response.json({ Data  : data})
    } catch (error) {
        response.json({error : error})
    }
  }

  module.exports = { dbData  }