module.exports = app => {
    const {tradeOrderController} = require("../controllers/tradeOrderController");
  
    var router = require("express").Router();

    router.post('/openOrderList',tradeOrderController.openOrderList);
    router.post('/openPairOrderList',tradeOrderController.openPairOrderList);
    router.post('/openSymbolOrderList',tradeOrderController.openSymbolOrderList);
    router.post('/cancelOrder',tradeOrderController.cancelOrder);
    router.post('/cancelPairOrder',tradeOrderController.cancelPairOrder);
    router.post('/activeOrder',tradeOrderController.activeOrder);
    router.post('/archiveOrder',tradeOrderController.archiveOrder);
    router.post('/massCancelOrder',tradeOrderController.massCancelOrder);
    router.post('/buySellTradeData',tradeOrderController.buySellTradeData);
    //router.get('/getsignature',spottradeController.getsignature);
    //router.get('/getLivePrice',spottradeController.getLastPrice);

    app.use("/api/v1", router);
  };