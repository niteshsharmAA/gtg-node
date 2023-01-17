const { createDB1Manager } = require('../models');
var ifsc = require('ifsc');
const { success, error, validation } = require('../middleware/responseApi');

const { helper } = require('../helper/helper')



class bankVerificationController {


    /**************  veryfy bank ifsc code ***********************/
    static addBankDetails = async (req, res) => {
        console.log(ifsc.validate(req.body.ifscCode));
        try {
            if (ifsc.validate(req.body.ifscCode) === true) {
                /************** add  bankuser details  ***********************/
                let { BankUserDetails } = await createDB1Manager();
               let bankUserDetails =  await BankUserDetails.create(req.body)
                    return res.json(success(' Bank Details Added successfully', bankUserDetails, 200))
            }
            else {
                return res.json(error("False", "Invalid IFSC"))
            }
        } catch (error) {
            return res.send({ status: 500, msg: error });
        }

    }

/************** Update BankUserDetails by id***********************/

  static updateBankDetails = async (req, res) => {
        console.log(ifsc.validate(req.body.ifscCode));
        try {
            if (ifsc.validate(req.body.ifscCode) === true) {
                let { BankUserDetails } = await createDB1Manager();
                const token = await helper.validToken('check', req.headers.authorization, null)
                console.log("token==" + token);
                if (!token) {
                  return res.json(error('Unauthorized User', 400))
                }
                let bankUserDetails = await BankUserDetails.update(req.body, { where: {id: req.params.id} });
                return res.json(success('BankUserDetails updated Successfully', bankUserDetails, 200))
            }
            else {
                return res.json(error("False", "Invalid IFSC"))
            }
        } catch (error) {
            return res.send({ status: 500, msg: error });
        }

    }

/************** get all bankUserDetail ***********************/

static getUserBankDetails = async (req, res) => {
    try {
      let { BankUserDetails }= await createDB1Manager();
      let bankUserDetails = await BankUserDetails.findAll({ where: req.query })
      return res.json(success(' all bankUsers  get Successfully', bankUserDetails, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }

  /************** get one BankUserDetails ***********************/

  static get = async (req, res) => {
    try {
      let { BankUserDetails }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let userDetails = await BankUserDetails.findOne({ where: req.query })
      return res.json(success('Single userDetails data', userDetails, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }

 /************** delet BankUserDetails by id***********************/


 static deleteBankUserDetails = async (req, res) => {
    try {
      let { BankUserDetails }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let bankUserDetails = await BankUserDetails.destroy({ where:{ id: req.params.id }});
      return res.json(success('BankUserDetails deleted Successfully', 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }




}



 


module.exports = { bankVerificationController }