const { route } = require("express/lib/application");
const { get } = require("express/lib/response");
const kyc = require('../middleware/kyc')
const auth = require('../middleware/auth')

module.exports = app => {
    const {UserController} = require("../controllers/userController");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/registration", UserController.signup);
    router.get("/sendMsg", UserController.sendMsg);
    router.post("/login", UserController.login);
    router.post("/socialAuthApi", UserController.socialAuthApi);
    // router.post("/mobileregister", UserController.phoneSignup);
    router.post("/resendOTP", UserController.resendOTP);
    router.post('/verifyMobileOtp',UserController.verifyPhoneOtp)
    router.get('/resendMailOtp',UserController.resendMailOTP)
    router.post('/mailVerify',UserController.mailVerify)
    router.post('/verifyEmailAndPhone',UserController.verifyEmailAndPhone)
    router.post('/updateProfileDetails',UserController.updateProfileDetails)
    router.post('/removeMobileOrEmail',UserController.removeMobileOrEmail)

    /////********Reset Password**********/////
    router.post('/changePassword',UserController.ChangePassword)
    router.post('/forgotPassword',UserController.ForgotPassword)
    router.post('/verifyOtp',UserController.verifyOtp);
    router.post('/resetPassword',UserController.ResetPassword)
    /////********Reset Password**********/////

    router.post("/validation", UserController.validation);

    /////********KYC Verification**********/////
    router.post('/aadharFileVerification',kyc.aadharFileVerification,UserController.aadharValidator)
    router.post('/kycVerification', UserController.kycVerification)
    router.get('/getKycVerificationDetails',UserController.getKycVerificationDetails)
    router.post('/drivingLicenseVerification',kyc.drivingLicenseVerification,UserController.drivingLicenseValidator)
    router.post('/passportVerification',kyc.passportVerification,UserController.passportValidator)
    router.post('/pancardVerification',kyc.pancardVerification,UserController.pancardValidator)

  

    router.post("/getUser", UserController.getUser);
    router.get("/getAllUser", UserController.getAllUsers);
    router.get('/sendmail',UserController.sendmail)
    router.post("/logout", UserController.logout);

    router.post("/updateUserAvatar", UserController.updateUserAvatar);

    app.use("/api/v1", router);
  };