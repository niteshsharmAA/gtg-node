module.exports = app => {
  const { futuretradeController } = require("../controllers/futuretradeController");

  var router = require("express").Router();

  //router.post("/orderBook", tradeController.orderBook);
  router.post("/buyFutureTrade", futuretradeController.buyFuturetrade);

  router.post("/sellFutureTrade", futuretradeController.sellFutureTrade);
  router.get("/futureBuyorderList", futuretradeController.futureBuyorderBook);
  router.get("/futureSellorderList", futuretradeController.futureSellorderBook);
  router.post("/futureSellOrderCancel", futuretradeController.futureSellOrderCancel);
  router.post("/futureBuyOrderCancel", futuretradeController.futureBuyOrderCancel);
  //router.post("/tradingChart", tradeController.tradingChart);
  //router.post("/depthChart", tradeController.depthChart);
  // router.get('/tradePairList',tradeController.tradePairList)
  //router.post('/buyTrade',tradeController.buytrade)
  // router.post("/sellTrade", tradeController.sellTrade);
  // router.post("/testTrade", futuretradeController.testTrade);
  router.post("/addTransaction", futuretradeController.addTransactions);
  router.post("/getallTransaction", futuretradeController.getTransactions);
  app.use("/api/v1", router);
};
