module.exports = app => {
    const {MasterController} = require('../controllers/masterController')
    var router = require("express").Router()
    /////********Country State City**********/////
    router.get('/getAllCountries',MasterController.AllCountryList)
    router.post('/getCountry',MasterController.Countryfindone)
    router.get('/getAllStates',MasterController.State)
    router.post('/getState',MasterController.Statefindone)
    router.post('/getStateByCountryId',MasterController.StatefindAll)

    router.get('/getAllCities',MasterController.City)
    router.post('/getCity',MasterController.Cityfindone)
    router.post('/getCityByStateId',MasterController.CityfindAll)
    /////********Country State City**********/////
    app.use("/api/v1", router);
}