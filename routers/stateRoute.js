module.exports = app => {
    const {stateController} = require("../controllers/stateController");
  
    var router = require("express").Router();

    router.get("/", stateController.findAll);
    router.get("/getState", stateController.findone);

    app.use("/api/state", router);
  };
  