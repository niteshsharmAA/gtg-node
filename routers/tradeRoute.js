const { signature } = require("../helper/siganture");

module.exports = app => {
    const {tradeController} = require("../controllers/tradeController");
  
    var router = require("express").Router();

    router.post("/orderBook", tradeController.orderBook);
    router.post("/latestPrice", tradeController.latestPrice);
    router.post("/tradingChart", tradeController.tradingChart);
    router.post("/depthChart", tradeController.depthChart);
    router.get('/tradePairList',tradeController.tradePairList)
    router.post('/buyTrade',tradeController.buytrade)
    router.post("/sellTrade", tradeController.sellTrade);


    router.post('/get-crypto-addres',signature.getCryptoAddress);
    app.use("/api/v1", router);
  };