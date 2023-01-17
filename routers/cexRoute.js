const { signature } = require("../helper/siganture");

module.exports = app => {
    const {cexController} = require("../controllers/cexController");
  
    var router = require("express").Router();
    router.get("/getCurrencyLimit", cexController.getCurrencyLimit);
    router.get("/getLastPrice/:symbol1/:symbol2", cexController.getLastPrice);
    router.get("/getLastPriceGivenMarket/:symbol1/:symbol2/:symbol3", cexController.getLastPriceGivenMarket);
    router.get("/getMyFee", cexController.getMyFee);
    router.get("/convertSymbol", cexController.convertSymbol);
    router.get("/getChart", cexController.getChart);

    app.use("/api/v1", router);
};