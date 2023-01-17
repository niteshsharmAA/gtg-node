
module.exports = app => {
    const {bankVerificationController} = require("../controllers/bankVerificationController");
  
    var router = require("express").Router();
    
    router.post("/verifyIfscAndCreatBankUser", bankVerificationController.addBankDetails);
    router.get("/getAllBankUser", bankVerificationController.getUserBankDetails);
    router.put("/updateBankDetails/:id", bankVerificationController.updateBankDetails);
    router.delete("/delete/:id", bankVerificationController.deleteBankUserDetails);

    app.use("/api/v1", router);
  };
  