const { createDB1Manager } = require('../models');
const {Op} = require('sequelize');

class countryController{
    static findAll = (req, res) => {
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

      static findone = (req, res) => {
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
}
module.exports={countryController}