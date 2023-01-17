module.exports = app => {
    const {cityController} = require("../controllers/cityController");
  
    var router = require("express").Router();

    router.get("/", cityController.findAll);
    router.get("/getCity", cityController.findone);

    app.use("/api/city", router);
  };
  