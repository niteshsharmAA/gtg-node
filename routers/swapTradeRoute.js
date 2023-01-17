module.exports = app => {
    const  swapTradeController  = require("../controllers/swapTradeController");
    const validate = require('../middleware/validate');
    const { liquidityVal, addSwapTradeVal } = require('../helper/validators');
    const router = require("express").Router();

    router.post("/swap/swap-currency", validate(addSwapTradeVal), swapTradeController.swapCurrency);
    router.post("/swap/add-swap-trade",validate(addSwapTradeVal), swapTradeController.addSwapTrade)
    router.get("/swap/all-swap-pools", swapTradeController.allSwapPools);
    router.get("/user-swap-history", swapTradeController.swapHistory);

    router.post("/swap/insert-currency-data", swapTradeController.insertLiveCurrency);
    router.get('/swap/get-pool-size',swapTradeController.getPoolSize);
    // router.get('/insert-pool-data',swapTradeController.insertPool);

    router.post('/swap/add-swap-liquidity-preview', validate(liquidityVal), swapTradeController.addLiquidityPreview);
    router.post('/swap/remove-liquidity', validate(liquidityVal), swapTradeController.removeLiquidity);
    router.post('/swap/add-liquidity', validate(liquidityVal), swapTradeController.addLiquidity);
    router.get('/swap/remove-liquidity-preview', validate(liquidityVal), swapTradeController.removeLiquidityPreview);
    router.get('/swap/get-liquidity-informtion-of-pool',swapTradeController.getLiquidityPoolInformation)
    router.get('/swap/get-liquidity-operation-user',swapTradeController.getLiquidityUser)

    router.get('/swap/claim-swap-reward',swapTradeController.claimSwapRewards)
    router.get('/swap/user-claimed-rewards',swapTradeController.userClaimedReward)
    router.get('/swap/user-unclaimed-rewards',swapTradeController.userUnclaimedRewards)


    router.get('/swap/get-pool-config/:quoteAsset/:baseAsset/:poolId',swapTradeController.getLiquidityPoolConfig)
    router.get('/swap/get-allPool-config',swapTradeController.getAllLiquidityPoolConfig)
    router.get('/swap/pool-overview',swapTradeController.poolOverview);

    app.use("/api/v1", router);
  };
  