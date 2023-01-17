const { createDB1Manager } = require('../models');
const { success, error, validation } = require('../middleware/responseApi');

const { helper } = require('../helper/helper')


class faqController {

    /**************  Add FAQ ***********************/
    static addFaq = async (req, res) => {
        try {
            let { faq } = await createDB1Manager();
            let faqAdd = await faq.create(req.body)
            return res.json(success(' FAQ Added successfully', faqAdd, 200));
        } catch (error) {
            return res.send({ status: 500, msg: error });
        }

    }
    /**************  List of  FAQ ***********************/
    static getAllFaq = async (req, res) => {
        try {
            let { faq } = await createDB1Manager();
            let getFaq = await faq.findAll({ where: req.query })
            return res.json(success(' all FAQ  get Successfully', getFaq, 200))
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }
    /**************  delete  FAQ  by id ***********************/
    static deleteFaq = async (req, res) => {
        try {
            let { faq } = await createDB1Manager();
            let deleteFaqData = await faq.destroy({ where: { id: req.params.id } });
            return res.json(success('FAQ deleted Successfully', deleteFaqData, 200))
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }
    /**************  Update  FAQ  by id ***********************/
    static updateFaq = async (req, res) => {
        try {
            let { faq } = await createDB1Manager();
            let updateFaqData = await faq.update(req.body, { where: { id: req.params.id } });
            return res.json(success('FAQ updated Successfully', updateFaqData, 200))
        } catch (error) {
            return res.send({ status: 500, msg: error });
        }

    }


 /************** get one FAQ(search) ***********************/

 static searchFaq = async (req, res) => {
    try {
      let { faq }= await createDB1Manager();
      let searchFaq = await faq.findOne({ where: req.query })
      return res.json(success('FAQ search successfully ', searchFaq, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }






}



module.exports = { faqController }