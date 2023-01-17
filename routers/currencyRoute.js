module.exports = app => {
    const { currencyController } = require("../controllers/currencyController");

    var router = require("express").Router();

    router.get("/", currencyController.getCurrencies);
    router.get("/getCurrency", currencyController.getSingleCurrency);
    router.post("/create", currencyController.addCurrencies);
    router.put("/update/:id", currencyController.updateCurrencies);
    router.delete("/delete/:id", currencyController.deleteCurrency);
    router.post("/convert", currencyController.currencyconverter);

    app.use("/api/v1/currency", router);
};
