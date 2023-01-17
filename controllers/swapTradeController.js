const { createDB1Manager } = require('../models');
const  { signature }  = require('../helper/siganture');
const sequelize = require('sequelize');
const async = require("async")
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi');
const axios = require('axios');
const logger = require('../logger');
const { token } = require("morgan");
let LOG_ID = 'controller/swapTradeController';

/*************************GET SWAP CRYPTO PRICE**********************/
exports.swapCurrency = async (req,res) => {
    logger.info(`${LOG_ID}/swapCurrency`);
    try {
        const getData = req.body;
        const swapFeeCalculate = await helper.swapFeeCalculate(getData);
        res.json(success("Swap Currency!",swapFeeCalculate,200));
    }catch(err){
        console.log(err)
        res.json(error(err.message, 400))
    }
}

/*************************ADD SWAP TRADE**********************/

exports.addSwapTrade = async (req,res) => {
    logger.info(`${LOG_ID}/addSwapTrade`);
    const token = await helper.validToken('check', req.headers.authorization, null);
    if (token != null && token != undefined) {
        try {
            let { Swap }= await createDB1Manager();
            if(req.body || req.body != "undefined"){
                const getData = req.body;
                const swapFeeCalculate = await helper.swapFeeCalculate(getData);
                swapFeeCalculate.userId = token.id;
                const data = await Swap.create(swapFeeCalculate);
                res.json(success("Swap Currency!",data,200));
            }else{
                res.json(error(err.message, 400));
            }
        } catch (err) {
            res.json(error(err.message, 400));
        }
    } else {
        res.json(error("Unauthorized User", 400))
        return;
    }
}


/*************************GET USER SWAP CRYPTO HISTORY***********/
exports.swapHistory = async (req,res) => {
    logger.info(`${LOG_ID}/swapHistory`);

    const token = await helper.validToken('check', req.headers.authorization, null)
    if (token != null && token != undefined) {
        try {
            let { Swap } = await createDB1Manager();
            const data = await Swap.findOne({ where: { userId: '' + token.id } });
            if (data != null && data != undefined) {
                res.json(success("Swap History!", data, 200));
            } else {
                res.json(error("No Swap History", 400));
            }
        } catch (err) {
            res.json(error(err.message, 400));
        }
    } else {
        res.json(error("Unauthorized User", 400))
        return;
    }
}


/*************************INSERT LIVE CURRENCY DUMMY DATA********/
exports.insertLiveCurrency =async (req,res) => {
    logger.info(`${LOG_ID}/insertLiveCurrency`);
    try{
        let { liveCoinPrice }= await createDB1Manager();
        const data = await helper.insertLiveCurrency(req.query.currency);
        if (data) {
            await liveCoinPrice.create({
                currencyname: data.symbol,
                currencyprice: data.price
            });
        }
        res.json(success("Current price", 400, data));
    } catch (err) {
        res.json(error("error", 400, err));
    }
}

/************************* SWAP POOLS**********************/
exports.allSwapPools = async (req,res) => {
    logger.info(`${LOG_ID}/insertPool`);
    try {
        // get data using binance api

    let { Pool }= await createDB1Manager();
    const swapPools = await axios({
        method: "GET",
        url: 'https://api.binance.com/sapi/v1/bswap/pools',
        headers: {
            "X-MBX-APIKEY": "xGM11m3npKELpHGLQpBaTDw9NHePT3VQa8inLBx7Kitu3N3hMv4fLdskzB9T5a4b"
        },
    })
    res.json(success("All Swap Pools!", swapPools.data, 200));
    // swapPools.data.forEach((element) => {
    //     savePool = Pool.findOrCreate({
    //         where: { poolName: element.poolName },
    //     });
    // })
    // const currencyLimit = await signature.getCurrencyLimit();
    // 
    } catch (err) {
        console.log(err.message)
        res.json(error("All Swap Pools!", 400));
    }
    
}

/*************************ADD LIQUIDITY PREVIEW***************/
exports.addLiquidityPreview = async (req,res) => {
    logger.info(`${LOG_ID}/addLiquidityPreview`);
    const token = await  helper.validToken('check', req.headers.authorization, null);
   if(token != null && token != undefined) {
        try{
            let { swapLiquidity }= await createDB1Manager();
            var data = await helper.swapFeeCalculate(req.body);
            data.poolId = req.body.poolId;
            data.type = req.body.type;
            data.status = 'Add';
            const chkSave = await swapLiquidity.create(data);    //deduction from spot balance account is pending
            if(chkSave){
                res.json(success("Liquidity Added!",data,200));
            }else{
                res.json(error("Liquidity Not Added!",400));
            }
        }catch(err){
            console.log(err);
            res.json(error(err.message, 400));
        }
    } else {
        res.json(error('Unauthorized User', 400));
        return;
    }
}

/*************************Remove LIQUIDITY PREVIEW************/
exports.removeLiquidityPreview = async (req,res) => {
    logger.info(`${LOG_ID}/removeLiquidityPreview`)
    try{
        const token = await  helper.validToken('check', req.headers.authorization, null);
        if(token != null && token != undefined) {
            var data = await helper.swapFeeCalculate(req.body);
            data.poolId = req.body.poolId;
            data.type = req.body.type;
            data.status = 'Remove'
            if(data){
                res.json(success("Preview!",data,200));
            }else{
                res.json(error("Something Went Wrong!",400));
            }
        }else{
            res.json(error('Unauthorized User',400));
            return;
        }
    }catch(err){
        logger.error(err);
        res.json(error(err.message,400));
    }
}



/*************************ADD LIQUIDITY **********************/
exports.addLiquidity = async (req,res) => {
    logger.info(`${LOG_ID}/addLiquidity`);
    const token = await  helper.validToken('check', req.headers.authorization, null);
   if(token != null && token != undefined) {
        try{
            let { swapLiquidity }= await createDB1Manager();
            var data = await helper.swapFeeCalculate(req.body);
            data.status = 'Add';
            data.userId = token.id;
            data.type = req.body.type;
            data.poolId = req.body.poolId;
            const chkSave = await swapLiquidity.create(data);    //deduction from spot balance account is pending
            res.json(success("Liquidity Added!",chkSave,200));
        }catch(err){
            logger.info(err);
            res.json(error(err.message,400));
        }
   }else{
    res.json(error('Unauthorized User',400));
    return;
   }
}

/*************************Remove LIQUIDITY *******************/
exports.removeLiquidity = async (req,res) => {
    logger.info(`${LOG_ID}/removeLiquidity`);

    const token = await  helper.validToken('check', req.headers.authorization, null);
   if(token != null && token != undefined) {
        try{
            let { swapLiquidity }= await createDB1Manager();
                var data = await helper.swapFeeCalculate(req.body);
                data.poolId = req.body.poolId;
                data.uuid = token.id;
                data.status = 'Remove';
                data.type = req.body.type;
                const chkSave = await swapLiquidity.create(data);    //deduction from spot balance account is pending
               
                if(chkSave){
                    res.json(success("Liquidity Removed",data,200));
                }else{
                    res.json(error("Liquidity Not Added!",400));
                }
        }catch(err){
            logger.info(err);
            res.json(error(err.message, 400));
        }
    } else {
        res.json(error('Unauthorized User', 400));
        return;
    }
}

/*************************GET LIQUIDITY INFORMATION *******************/
exports.getLiquidityUser = async (req,res) => {
    logger.info(`${LOG_ID}/getLiquidityUser`);
    const token = await  helper.validToken('check', req.headers.authorization, null);
   if(token != null && token != undefined) {
        try{
            let { swapLiquidity } = await createDB1Manager();
             const getLiquidityData = await swapLiquidity.findAll({where:{userId:token.id}});
             if(getLiquidityData.length){
                res.json(success("User Liquidity Information!",getLiquidityData,200));
            }else{
                res.json(error("No Liquidity Information!",400));
            }
        }catch(err){
            logger.error(err);
            res.json(error(err.message,400));
        }
   }else{
    res.json(error('Unauthorized User',400));
    return;
   }
}



/*************************GET POOL SIZE**********************/
exports.getPoolSize = async (req,res) => {
    logger.info(LOG_ID,'getPoolSize');
    const token = await  helper.validToken('check', req.headers.authorization, null);
    if(token != null  && token != undefined){
        try {
            let { swapLiquidity }= await createDB1Manager();
            if(req.body.poolId != null && req.body.poolId){
                //find pool size according pool id...coming in body
                const totalAmount = await swapLiquidity.findAll({
                    attributes: [[sequelize.fn('sum',sequelize.col('poolId')),'total']],
                    raw: true,
                });
                res.json(success("Current pool size!",totalAmount[0].total ,200));
            }else{
                res.json(error('Pool Missing',400));
            }
        } catch (err) {
            logger.error(err.message);
            res.json(error(err.message,400))
        }   
    }else{
        res.json(error('Unauthorized Request',400));
        return;
    }
}


/****************GET LIQUIDITY POOL INFORMATION**************/
exports.getLiquidityPoolInformation = async (req,res) => {
    logger.info(LOG_ID,'getLiquidityPoolInformation');

    const token = await  helper.validToken('check', req.headers.authorization, null);
    console.log('token',token)
   if(token != null && token != undefined) {
        try {
            // var liquidityPool = await axios({
            //     method: "get",
            //     url: 'https://api.binance.com/sapi/v1/bswap/liquidity',
            //   })
              console.log('liquidityPool')
              res.json(success('success',200));
        } catch (err) {
            logger.error(err);
            res.json(error(err.message,500));
        }
    } else {
        res.json(error('Unauthorized User', 400));
        return;
    }
}

/*************************Claimed Rewards **********************/

exports.claimSwapRewards = async (req,res) => {
    logger.info(LOG_ID,'claimSwapRewards');
    try {
        let { Swap }= await createDB1Manager();
        const token = await  helper.validToken('check', req.headers.authorization, null);
        if(token != null  && token != undefined){
            const userId = token.id;
            Swap.update({swaprewards:0,claimedstatus:true},{where:{userId:userId}, returning: true})
            
            res.json(success('Successfully Claimed',[],200))
        }else{
            logger.error('Unauthorise User');
            res.json(error('Unauthorized User',400));
            return;
        }
    } catch (err) {
        logger.error(err.message);
        res.json(error(err.message,400));   
    }
}

/*************************User Claimed Rewards **********************/

exports.userClaimedReward = async (req,res) => {
    logger.info(LOG_ID,'userClaimedReward');
    try {
        let { Swap }= await createDB1Manager();
        const token = await  helper.validToken('check', req.headers.authorization, null);
        if(token != null  && token != undefined){
            const userId = token.id;
            const getReward = await Swap.findAll({where:{claimedstatus:true}},{where:{userId:userId}})
            if(getReward){
                res.json(success('User Rewards',getReward,200))
            }else{
                res.json(success('No Claimed Rewards',[],200))
            }
        }else{
            logger.error('Unauthorise User');
            res.json(error('Unauthorized User',400));
            return;
        }
    } catch (err) {
        logger.error(err.message,400);
        res.json(error(err.message))
    }
}

/*************************User Unclaimed Rewards **********************/

exports.userUnclaimedRewards = async ( req, res ) => {
    logger.info(LOG_ID,'getUnclaimedRewards');
    try {
        let { Swap }= await createDB1Manager();
        const token = await  helper.validToken('check', req.headers.authorization, null);
        if(token != null  && token != undefined){
            const userId = token.id;
            const data = await Swap.findAll({where:{claimedstatus:false}},{where:{userId:userId}});
            // console.log(getUnclaimedReward);
            // let totalUnclaimedRewards = {
            //     getUnclaimedReward: {
            //         [getUnclaimedReward.quoteasset]:[getUnclaimedReward.fromcurrency],
            //         [getUnclaimedReward.baseasset]:[getUnclaimedReward.tocurrency],
            //         BNB:[getUnclaimedReward.fee],
            //     },
            //     details:{
            //         [`${getUnclaimedReward.quoteasset}/${getUnclaimedReward.fromcurrency}`]:{
            //             [getUnclaimedReward.quoteasset]:[getUnclaimedReward.fromcurrency],
            //             [getUnclaimedReward.baseasset]:[getUnclaimedReward.tocurrency]
            //         },

            //         "BNB/BTC":{
            //             "BNB":getUnclaimedReward.fee
            //         }
            //     }
            // }
            if(data.length){
                res.json(success('User Claimed Rewards',data,200))
            }else{
                res.json(success('No Claimed Rewards',[],200))
            }
        }else{
            logger.error('Unauthorise User');
            res.json(error('Unauthorized User',400));
            return;
        }
    } catch (err) {
        logger.error(err.message,400);
        res.json(error(err.message))
    }
}
 
/*************************GET LIQUIDITY POOL CONFIG**********************/
exports.getLiquidityPoolConfig = async (req, res) => {
    logger.info(LOG_ID,'getLiquidityPoolConfig');
    const token = await helper.validToken('check', req.headers.authorization, null);
    if (token != null && token != undefined) {
        try {
            if (req.params.quoteAsset && req.params.baseAsset) {
                let { Currency, swapLiquidity } = await createDB1Manager();
                let quoteAssetConfig = await Currency.findOne({ where: { currency: req.params.quoteAsset } });
                let baseAssetConfig = await Currency.findOne({ where: { currency: req.params.baseAsset } });
                let poolDetails = await swapLiquidity.findOne({ where: { poolId: req.params.poolId } });
                poolDetails = JSON.parse(JSON.stringify(poolDetails));
                return res.send({
                    ...poolDetails, assetConfigure: {
                        quoteAsset: quoteAssetConfig,
                        baseAsset: baseAssetConfig
                    }
                })

            }
            else {
                return res.json(error('Unsufficient data', 500));
            }
        } catch (err) {
            console.log(err);
            res.json(error(err.message, 500));
        }
    } else {
        res.json(error('Unauthorized User', 400));
        return;
    }
}
/*************************GET ALL LIQUIDITY POOL CONFIG**********************/

exports.getAllLiquidityPoolConfig = async (req, res) => {
    logger.info(LOG_ID,'getAllLiquidityPoolConfig');
    const token = await helper.validToken('check', req.headers.authorization, null);
    if (token != null && token != undefined) {
        try {
            let { Currency, swapLiquidity } = await createDB1Manager();
            let poolDetails = await swapLiquidity.findAll();
            poolDetails = JSON.parse(JSON.stringify(poolDetails));
            let data = [];
            async.each(poolDetails, (result, after_result) => {
                Currency.findOne({ where: { currency: result.quoteAsset } }).then((quoteAssetConfig) => {
                    Currency.findOne({ where: { currency: result.baseAsset } }).then((baseAsset) => {
                        let obj = {
                            ...result, assetConfigure: {
                                quoteAsset: quoteAssetConfig,
                                baseAsset: baseAsset
                            }
                        }
                        data.push(obj)
                        after_result();
                    }).catch(error=>{
                        res.send({status:500,msg:error})
                    })
                }).catch(err=>{
                    res.send({status:500,msg:err})
                })           
             
            }, (err) => {
                if (err) {
                    res.send({ status: 500, msg: err });
                }
                res.send({ status: 200, data: data});
            })

        } catch (err) {
            console.log(err);
            res.json(error(err.message, 500));
        }
    } else {
        res.json(error('Unauthorized User', 400));
        return;
    }
}

exports.poolOverview = async (req, res) => {
    logger.info(LOG_ID,'poolOverview');
    try {
        const getPoolData = await signature.tickerMarket(req);
        if(getPoolData.data.length){
            res.json(success('Pool Data',getPoolData.data,200))
        }else{
            res.json(success('Pool Data Empty',[],200))
        }
    } catch (err) {
        console.log(err.message);
        return;
    }
}
