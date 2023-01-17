module.exports = app => {
    const { transactionFeesController } = require("../controllers/transactionFeesController");

    var router = require("express").Router();

    router.get("/", transactionFeesController.getTransactionFees);
    router.get("/getTransactionFee", transactionFeesController.getSingleTransactionFee);
    router.post("/create", transactionFeesController.addTransactionFees);
    router.put("/update/:id", transactionFeesController.updateTransactionFees);
    router.delete("/delete/:id", transactionFeesController.deleteTransactionFee);

    app.use("/api/v1/transactionFees", router);
};
