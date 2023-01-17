module.exports = app => {
    const { razorpayTransaction } = require("../controllers/razorpayController");

    var router = require("express").Router();

    router.post("/create-order", razorpayTransaction.createOrder);
    router.put("/checkout-order", razorpayTransaction.checkoutOrder);

    app.use("/api/v1/razorpay", router);
};
