
module.exports = app => {
    const {faqController} = require("../controllers/faqController");
  
    var router = require("express").Router();
    
    router.post("/addFaq", faqController.addFaq);
     router.get("/listOfFaq", faqController.getAllFaq);
     router.put("/updateFaq/:id", faqController.updateFaq);
     router.delete("/deleteFaq/:id", faqController.deleteFaq);

    app.use("/api/v1", router);
  };