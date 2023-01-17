const Binance = require('node-binance-api');
const { createDB1Manager } = require('../models');
const crypto = require('crypto')
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi');
const { stat } = require('fs');
const { getTestMessageUrl } = require('nodemailer');
const res = require('express/lib/response');
const req = require('express/lib/request');
const binance = new Binance().options({
  APIKEY: 'hae7pJNy8H1tz7Cnz727SMivUdPisRG7CpZTKli4LIoKWukbZUR5S1YBOoMw2DEw',
  APISECRET: '1q0hehPRN0deWBfM2oSK2ZAipwfViFP5laTkGg82jGkMp4kk0m4Id5T88kshrstk'
});




class tradeController {


  static orderBook = async (req,res) => {
    binance.trades(req.body.symbol, (error, ticker) => {
      res.json(success("Ok.", ticker, res.statusCode));
    });

  }
  static latestPrice = async (req,res) => {
        binance.prices(req.body.symbol, (error, ticker) => {
          res.json(success("Ok.", ticker, res.statusCode));
        });
    
      }

    static tradingChart = async (req,res) => {
      //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      let symbol = req.body.symbol;
      binance.candlesticks("BNBBTC", "5m", (error, ticks, symbol) => {
        res.json(success("Ok.", ticks, res.statusCode));
        // console.info("candlesticks()", ticks);
        // let last_tick = ticks[ticks.length - 1];
        // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        // console.info(symbol+" last close: "+close);
      }, {limit: 500, endTime: 1514764800000});
  
    }

    static depthChart = async (req,res) => {
      let symbol = req.body.symbol;
      binance.depth(symbol, (error, depth, symbol) => {
        res.json(success("Ok.", depth, res.statusCode));
      });
  
    }

    static tradePairList = async(req,res) => {
      try {
        let { TradePairs }= await createDB1Manager();
        const title = req.query.title;
        var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        // tradepair.findAll({ where: condition })
        TradePairs.findAll({ where: condition })
        .then(tradepairData => {
          res.json(success('TradePair List Found',tradepairData,200))
        })
        .catch(tradepairDataError => {
          res.status(400).json(error(tradepairDataError.message,400))
        })
      } catch (error) {
       res.json({ mesage:error.message, statusCode:400})
        // res.json(error(error,400))
      }
    }

    static buytrade = async(req,res) => {
      try {
        const token = await helper.validToken('check', req.headers.authorization, null)
        if (!token) {    
          res.status(400).json(error('Unauthorized User',400))
          return;
        }
        req.body.userid = token.id
        if(req.body.trade_type == 1)
        {
          var limitOrder = await this.limitOrder(req.body)
          .then(limitOrderSuccess => {
            res.json(success('Limit Buy Trade Place Successfully',limitOrderSuccess,200))
            return
          })
          .catch(limitOrderError => {
            res.status(400).json(error(limitOrderError.message,400))
            return
           })
    
        }
        if(req.body.trade_type == 2)
        {
          var marketOrder = await this.marketOrder(req.body)
          .then(marketOrder => {
            if(marketOrder == null)
            {
              res.status(400).json(error('Trade Pair Not Found',400))
              return
            }
            else
            {
              res.json(success('Market Buy Trade Place Successfully',marketOrder,200))
              return
            }       
           
          })
          .catch(marketOrderError => {
            res.status(400).json(error(marketOrderError.mesage,400))
            return
           })
        }
       
      } catch (error) {
        res.status(400).json(error(error.mesage,400))
        return
      }
      
    }

    static limitOrder = async (data)=>{
      let { buyTrade }= await createDB1Manager();
      const trade_id = crypto.randomBytes(16).toString("hex");
      const buyTradeData = {
        uid : data.userid,
        tradepair_id : data.tradepair_id,
        trade_id : trade_id,
        trade_type : data.trade_type,
        price : data.price,
        quantity : data.quantity,
        trade_total_value : data.trade_total_value,
        commission : data.commission,
        after_commission_total : data.remaining_quantity,
        remaining_quantity : data.remaining_quantity,
        remaining_amount : data.remaining_amount,
        status : data.status,
        stop_loss_price : data.stop_loss_price, 
        target_price : data.target_price
      }
      return buyTrade.create(buyTradeData)
      
    }

    static marketOrder = async(data) => {
      let { buyTrade }= await createDB1Manager();
      const trade_id = crypto.randomBytes(16).toString("hex");
      var symbol = await this.getPair(data.tradepair_id)
      if(symbol == null)
      {
        return symbol
      }
      var liveprice = await helper.getLivePrice(symbol)
  
      const buyTradeData = {
        uid : data.userid,
        tradepair_id : data.tradepair_id,
        trade_id : trade_id,
        trade_type : data.trade_type,
        price : liveprice,
        quantity : data.quantity,
        trade_total_value : data.trade_total_value,
        commission : data.commission,
        after_commission_total : data.remaining_quantity,
        remaining_quantity : data.remaining_quantity,
        remaining_amount : data.remaining_amount,
        status : data.status,
        stop_loss_price : data.stop_loss_price, 
        target_price : data.target_price
      }
      return buyTrade.create(buyTradeData)
    }


    static sellTrade = async (req,res) => {
      try {
        const token = await helper.validToken('check', req.headers.authorization, null)
        if (!token) {    
          res.status(400).json(error('Unauthorized User',400))
          return;
        }
        req.body.uid = token.id
      req.body.trade_id = crypto.randomBytes(16).toString("hex");
      if(req.body.trade_type == 1){
        var LimitSellTrade = this.LimitSellTrade(req.body)
      .then(LimitSellTradeSuccess => {
        res.json(success('Limit Sell Trade Place Successfully !',LimitSellTradeSuccess,200))
        return;
      })
      .catch(LimitSellTradeError => {
        res.json(success(LimitSellTradeError.message,400,null))
        return;
       })
      }
      else{
        var MarketSellTrade = this.MarketSellTrade(req.body)
      .then(MarketSellTradeSuccess => {
        if(marketOrder == null)
        {
          res.status(400).json(error('Trade Pair Not Found',400))
          return
        }
        else
        {
          res.json(success('Market Sell Trade Place Successfully',MarketSellTradeSuccess,200))
          return
        }       
      })
      .catch(MarketSellTradeError => {
        res.json(success(MarketSellTradeError.message,400,null))
        return;
       })
      }
      } catch (error) {
        res.status(400).json(error(error.message,res.statusCode))
        return;
      }
      
    }

    static LimitSellTrade = async(data) => {
      let { sellTrade }= await createDB1Manager();
        const sellTradeData = {
          uid : data.uid,
        trade_id: data.trade_id,
        tradepair_id : data.tradepair_id,
        trade_type : data.trade_type,
        price : data.price,
        quantity : data.quantity,
        trade_total_value : data.trade_total_value,
        after_commission_table : data.after_commission_table,
        remaining_quality : data.remaining_quality,
        remaining_amount : data.remaining_amount,
        commission : data.commission,
        stop_loss_price : data.stop_loss_price,
        target_price : data.target_price,
        status : 1
      }
      return sellTrade.create(sellTradeData)
    }

    static MarketSellTrade = async(data) => {
      let { sellTrade }= await createDB1Manager();
      var symbol = await this.getPair(data.tradepair_id)
      var liveprice = await helper.getLivePrice(symbol)
      const sellTradeData = {
      uid : data.uid,
      trade_id: data.trade_id,
      tradepair_id : data.tradepair_id,
      trade_type : data.trade_type,
      price : liveprice,
      quantity : data.quantity,
      trade_total_value : data.trade_total_value,
      after_commission_table : data.after_commission_table,
      remaining_quality : data.remaining_quality,
      remaining_amount : data.remaining_amount,
      commission : data.commission,
      stop_loss_price : data.stop_loss_price,
      target_price : data.target_price,
      status : 1
    }
    return sellTrade.create(sellTradeData)
  }

  static getPair = async (id) => {
    let { TradePairs }= await createDB1Manager();
    return new  Promise( async function (resolve, reject) {
      let getTrade = await TradePairs.findOne({where:{id:id}})
      var tradePair;
      if(getTrade){
        tradePair = getTrade.coin_one+''+getTrade.coin_two;
      }else{
        tradePair =null;
      }
      resolve(tradePair) 
    });

  }


  }

  

module.exports={
  tradeController,
}
// io.on('connection', (socket) => {

//     socket.on("getredeem", (data) => {
//         console.log(data,"data");
//         axios({
//             url: 'https://api1.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT',
//             method: 'get'
//           }).then(res => {
//             io.sockets.emit("new message",payload)
//     })
// })

// })