const { createDB1Manager } = require('../models');
const {Op} = require('sequelize');
const sgmail = require('@sendgrid/mail')
const API_KEY = process.env.sendGridAppId;
sgmail.setApiKey(API_KEY)
class MasterController
{
    static AllCountryList =async (req, res) => {
      try{
      let { Country }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        Country.findAll({ where: condition })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static Countryfindone = async (req, res) => {
        try{
        let { Country }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        Country.findOne({
            where : { id : req.body.id }
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static State = async (req, res) => {
        try{
          let { State }= await createDB1Manager();
          const title = req.query.title;
          var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
          State.findAll({ country_id: req.body.country_id })
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving tutorials."
              });
            });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static Statefindone = async (req, res) => {
        try{
        let { State }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        State.findOne({
            where: {
              id: req.body.id
            }
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
      
      static StatefindAll = async (req, res) => {
        try{
        let { State }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        State.findAll({
            where : { country_id : req.body.country_id }
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static City = async (req, res) => {
        try{
        let { City }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        City.findAll({ state: req.body.state_id })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static Cityfindone = async (req, res) => {
        try{
        let { City }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        City.findOne({
            where : { id : req.body.id }
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      };
    
      static CityfindAll = async (req, res) => {
        try{
        let { City }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        City.findAll({
            where : { state_id : req.body.state_id }
          })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving tutorials."
            });
          });
        } catch (error) {
          res.status(400).json(error(error.message, 400))
        }
      }; 
    

}

module.exports={ MasterController }