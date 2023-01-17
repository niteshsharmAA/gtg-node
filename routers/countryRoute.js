module.exports = app => {
    const {countryController} = require("../controllers/countryController");
  
    var router = require("express").Router();

    router.get("/", countryController.findAll);
    router.get("/getCountry", countryController.findone);

    app.use("/api/countries", router);
  };
  