
module.exports = app => {
    const {SecurityController} = require('../controllers/securityController')
    var router = require("express").Router()
    /////********2Fa Authentication**********/////
    router.get('/google/enable2fa',SecurityController.google_2fa_requesting)
    router.post('/google/validate2fa',SecurityController.enable_google_2facode)
    router.post('/google/requestDisable2fa',SecurityController.disable_google_2fa_request)
    router.post('/google/disable2fa',SecurityController.disable_google_2fa_auth)
    /////********2Fa Authentication**********/////

     /////********2Fa Mobile Authentication**********/////
     router.post('/mobile/enable2fa',SecurityController.enable_mobile_2fa)
     router.post('/mobile/validate2fa',SecurityController.validate_mobile_2fa)
     router.post('/mobile/requestDisable2fa',SecurityController.request_mobile_disable2fa)
     router.post('/mobile/disable2fa',SecurityController.disable_mobile_2fa)
     /////********2Fa Mobile Authentication**********/////
    app.use("/api/v1", router);
}