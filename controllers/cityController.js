const { createDB1Manager } = require('../models');
const City = db.city;
const Op = db.Sequelize.Op;

class cityController{
    static findAll = async (req, res) => {
      try{
        let { City }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        City.findAll({ where: condition })
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

      static findone = async (req, res) => {
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
}
module.exports={cityController}