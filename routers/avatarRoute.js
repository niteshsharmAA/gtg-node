module.exports = app => {
    const {avatarController} = require("../controllers/avatarController");
  
    var router = require("express").Router();
    
    router.get("/getAll", avatarController.getAllAvatars);
    router.post("/add", avatarController.addAvatar);

    app.use("/api/v1/avatars", router);
  };
  