module.exports = app => {
    const {spottradeController} = require("../controllers/spottradeController");
  
    var router = require("express").Router();

    router.post('/buySpottrade',spottradeController.buySpottrade);
    router.post('/sellSpottrade',spottradeController.sellSpottrade);
    router.get('/traidPairData',spottradeController.traidPairData);
    router.post('/spotUserOrderBook',spottradeController.spotUserOrderBook);
    router.post('/spotUserOpenOrderBook',spottradeController.spotUserOpenOrderBook);
    router.post('/spotUserOrderDetails',spottradeController.spotUserOrderDetails);
    router.post('/spotBuyOrderCancel',spottradeController.spotBuyOrderCancel);
    router.post('/spotSellOrderCancel',spottradeController.spotSellOrderCancel);
    router.post('/spotOpenOrderCancel',spottradeController.spotBuySellOpenOrderCancel);
    //router.post('/buyTradeData',spottradeController.buyTradeData);
   // router.post('/tradeOrderDetails',spottradeController.tradeOrderDetails);
   // router.post('/transactionDetails',spottradeController.tradeOrderTransactionDetails);
    //router.post('/openOrderList',spottradeController.openOrderList);
    //router.post('/openPairOrderList',spottradeController.openPairOrderList);
    //router.post('/openSymbolOrderList',spottradeController.openSymbolOrderList);
    //router.post('/cancelOrder',spottradeController.cancelOrder);
    //router.post('/cancelPairOrder',spottradeController.cancelPairOrder);
    //router.post('/activeOrder',spottradeController.activeOrder);
    //router.post('/archiveOrder',spottradeController.archiveOrder);
    //router.post('/massCancelOrder',spottradeController.massCancelOrder);
    //router.get('/getsignature',spottradeController.getsignature);
    //router.get('/getLivePrice',spottradeController.getLastPrice);

    app.use("/api/v1", router);
  };