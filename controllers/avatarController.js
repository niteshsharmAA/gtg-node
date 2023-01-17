const { createDB1Manager } = require('../models');
// const Avatar = db.avatar;
const { success, error, validation } = require('../middleware/responseApi')


class avatarController {
  
  // // Retrieve all avatars from database.
  static getAllAvatars = async (req, res) => {
    let { Avatar }= await createDB1Manager();
    Avatar.findAll({ attributes: ['id', 'url'] })
      .then(data => {
        console.log(data)
        res.json(success("Get All Avatar", data, 200));
      })
      .catch(err => {
        console.log(err)
        res.json(error(err.message || "Some error occurred while retrieving avatar.", 400))
      });
  };

  // // Add avatars to database
  static addAvatar =async (req, res) => {
    let { Avatar }= await createDB1Manager();
    Avatar.create({ url: req.body.url })
      .then(data => {
        res.json(success("Avatar added successfully", data, 200));
      })
      .catch(err => {
        res.json(error(err.message || "Some error occurred while adding avatar.", 400))
      });
  };


}
module.exports = { avatarController }