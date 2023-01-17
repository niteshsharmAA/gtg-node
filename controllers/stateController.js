const { createDB1Manager } = require('../models');
const {Op} = require('sequelize');

class stateController{
    static findAll = (req, res) => {
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

      static findone = (req, res) => {
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

      static FindbyId = (req,res) => {
        try{
        let { State }= await createDB1Manager();
        const title = req.query.title;
      // const country_id = req.body.country_id;
        State.findAll({ where: {country_id: req.body.country_id} }).success()
          .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
      } catch (error) {
        res.status(400).json(error(error.message, 400))
      }
    }
}
module.exports={stateController}