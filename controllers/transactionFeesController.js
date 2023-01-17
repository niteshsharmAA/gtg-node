const { createDB1Manager } = require('../models');
const crypto = require('crypto')
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi');
// const TransactionFeesModel = db.transactionFeesModel;



class transactionFeesController {



/************** get all TransactionFee ***********************/

  static getTransactionFees = async (req, res) => {
    try {
      let { transactionFees }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let TransactionFees = await transactionFees.findAll({ where: req.query })
      return res.json(success('all TransactionFee Successfully', TransactionFees, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** add TransactionFee ***********************/

  static addTransactionFees = async (req, res) => {
    try {
      let { transactionFees }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let TransactionFees = await transactionFees.create(req.body)
      return res.json(success('TransactionFee added Successfully', TransactionFees, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** get one TransactionFee ***********************/

  static getSingleTransactionFee = async (req, res) => {
    try {
      let { transactionFees }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let TransactionFees = await transactionFees.findOne({ where: req.query })
      return res.json(success('Single TransactionFee data', TransactionFees, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** update TransactionFee ***********************/

  static updateTransactionFees = async (req, res) => {
    try {
      let { transactionFees }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let TransactionFees = await transactionFees.update(req.body, { where: {id: req.params.id} });
      return res.json(success('TransactionFee updated Successfully', TransactionFees, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }




  /************** delete TransactionFee ***********************/

  static deleteTransactionFee = async (req, res) => {
    try {
      let { transactionFees }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let TransactionFees = await transactionFees.destroy({ where:{ id: req.params.id }});
      return res.json(success('TransactionFee deleted Successfully', 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


}

module.exports = {
  transactionFeesController,
}