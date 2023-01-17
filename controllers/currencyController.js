const { createDB1Manager } = require('../models');
const crypto = require('crypto')
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi');
// const Currency = db.Currency;



class currencyController {



  /************** get all Currency ***********************/

  static getCurrencies = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let Currencies = await Currency.findAll({ where: req.query })
      return res.json(success('all Currency Successfully', Currencies, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** add Currency ***********************/

  static addCurrencies = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let Currencies = await Currency.create(req.body)
      return res.json(success('Currency added Successfully', Currencies, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** get one Currency ***********************/

  static getSingleCurrency = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let Currencies = await Currency.findOne({ where: req.query })
      return res.json(success('Single Currency data', Currencies, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** update Currency ***********************/

  static updateCurrencies = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let Currencies = await Currency.update(req.body, { where: { id: req.params.id } });
      return res.json(success('Currency updated Successfully', Currencies, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }




  /************** delete Currency ***********************/

  static deleteCurrency = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let Currencies = await Currency.destroy({ where: { id: req.params.id } });
      return res.json(success('Currency deleted Successfully', 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }



  // currencyconverter
  /************** convert Currency ***********************/

  static currencyconverter = async (req, res) => {
    try {
      let { Currency }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let obj = req.body;
      let baseFromPrice = 0;
      let baseToPrice = 0;
      let fromCurrency = await Currency.findOne({ where: { currency: obj.from } });
      let toCurrency = await Currency.findOne({ where: { currency: obj.to } });
      if (fromCurrency && toCurrency) {
        if (parseFloat(fromCurrency.unitValue) === 1) {
          baseFromPrice = parseFloat(fromCurrency.baseValueInUSD) * obj.amount;
        }
        else {
          baseFromPrice = (parseFloat(fromCurrency.baseValueInUSD) * obj.amount) / parseFloat(fromCurrency.unitValue);
        }
        baseToPrice = (toCurrency.unitValue / toCurrency.baseValueInUSD) * baseFromPrice;
        return res.json(success('converted currency',baseToPrice, 200))
      }
      else {
        return res.json(success('currently we are not suppoerted to this currency', 200))
      }
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


}

module.exports = {
  currencyController,
}