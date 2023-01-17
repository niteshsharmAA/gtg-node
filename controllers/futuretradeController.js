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
class futuretradeController {


/******** Future Sell Trade postion list function start *******/
  static futureSellorderBook = async (req, res) => {
    try {
      let { futureSellTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const user_id = token.id
      futureSellTrade.findAll({ where: { uuid: user_id } })
        .then(futureSellData => {
          res.json(success('Future Sell Order List Found', futureSellData, 200))
        })
        .catch(futureSellDataError => {
          res.json(error(futureSellDataError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })
      // res.json(error(error,400))
    }

  }

  /******** Future Buy Trade postion list function start *******/

  static futureBuyorderBook = async (req, res) => {
    try {
      let { futureBuyTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const user_id = token.id
      futureBuyTrade.findAll({ where: { uuid: user_id } })
        .then(futureBuyData => {
          res.json(success('Future Buy Order List Found', futureBuyData, 200))
        })
        .catch(futureBuyDataError => {
          res.json(error(futureBuyDataError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }


  /******** Future Sell Trade postion list function start *******/

  /******** Future Buy Trade Cancel Order start *******/

  static futureBuyOrderCancel = async (req, res) => {
    try {
      let { futureBuyTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const trade_order_id = req.body.trade_id;
      console.log("trade_order_id==" + trade_order_id);
      const user_id = token.id;
      const buyTradeCancelData = {
        status: 2,
      }
      const foundOrder = await futureBuyTrade.findOne({ where: { trade_id: trade_order_id } })
        .then(foundOrder => {
          futureBuyTrade.update(buyTradeCancelData, { where: { trade_id: trade_order_id } })
            .then(buyTradeCancelData => {
              if (buyTradeCancelData == 1) {
                const cancelOrderData = futureBuyTrade.findOne({ where: { trade_id: trade_order_id } })
                  .then(cancelOrderData => {

                    res.json(success('Order Cancel Sucessfully', cancelOrderData, 200))
                  })
              } else {

                res.json(error('Some Error Occured', 400))
              }
            })
          //res.json(success('No Trade Order Found.=',foundOrder,200))
        })
        .catch(CancelOrderError => {
          res.json(error(CancelOrderError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /******** Future Buy Trade Cancel Order End *******/
  /******** Future Sell Trade Cancel Order start *******/

  static futureSellOrderCancel = async (req, res) => {
    try {
      let { futureSellTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const trade_order_id = req.body.trade_id;
      console.log("trade_order_id==" + trade_order_id);
      const user_id = token.id;
      const sellTradeCancelData = {
        status: 2,
      }
      const foundOrder = await futureSellTrade.findOne({ where: { trade_id: trade_order_id } })
        .then(foundOrder => {
          futureSellTrade.update(sellTradeCancelData, { where: { trade_id: trade_order_id } })
            .then(sellTradeCancelData => {
              if (sellTradeCancelData == 1) {
                const cancelOrderData = futureSellTrade.findOne({ where: { trade_id: trade_order_id } })
                  .then(cancelOrderData => {

                    res.json(success('Order Cancel Sucessfully', cancelOrderData, 200))
                  })
              } else {

                res.json(error('Some Error Occured', 400))
              }
            })
          //res.json(success('No Trade Order Found.=',foundOrder,200))
        })
        .catch(CancelOrderError => {
          res.json(error(CancelOrderError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /********* Future Sell Trade Function End ***************/
  /********* Future Buy Trade Function Start ***************/

  static buyFuturetrade = async (req, res) => {
    console.log('okay');
    try {
      //console.log(User);
      const token = await helper.validToken('check', req.headers.authorization, null)
      //console.log("token=="+token);
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      req.body.userid = token.id
      let tradepair_id = req.body.tradepair_id;
      var symbol = await this.getPair(tradepair_id)
      req.body.symbol = symbol
      console.log('trade_type==' + req.body.trade_type);
      if (req.body.trade_type == 1) {
        var futureBuylimitOrder = await this.futureBuylimitOrder(req.body)
          .then(futureBuylimitOrderSuccess => {
            res.json(success('Future Buy Limit Trade Place Successfully', futureBuylimitOrderSuccess, 200))
            return
          })
          .catch(futureBuylimitOrderError => {
            res.json(error(futureBuylimitOrderError.message, 400))
            return
          })

      }
      if (req.body.trade_type == 3) {
        console.log('trade2==' + req.body.trade_type);
        var futureBuyStoplimitOrder = await this.futureBuyStoplimitOrder(req.body)
          .then(futureBuyStoplimitOrderSuccess => {
            res.json(success('Future Stop Limit Buy Trade Place Successfully', futureBuyStoplimitOrderSuccess, 200))
            return
          })
          .catch(futureBuyStoplimitOrderError => {
            res.json(error1(futureBuyStoplimitOrderError.message, 400))
            return
          })

      }
      if (req.body.trade_type == 2) {
        var futureBuymarketOrder = await this.futureBuymarketOrder(req.body)
          .then(futureBuymarketOrder => {
            if (futureBuymarketOrder == null) {
              res.json(error('Trade Pair Not Found', 400))
              return
            }
            else {
              res.json(success('Future Buy Market Trade Place Successfully', futureBuymarketOrder, 200))
              return
            }

          })
          .catch(futureBuymarketOrderError => {
            res.json(error(futureBuymarketOrderError.mesage, 400))
            return
          })
      }

    } catch (error) {
      res.json(error(error.mesage, 400))
      return
    }

  }
  /********* Future Buy Trade Function End ***************/


  /************** Future Buy limit order function Start  ********************/

  static futureBuylimitOrder = async (data) => {
    console.log(data);
    let { futureBuyTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: data.price,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureBuyTrade.create(buyTradeData)

  }
  /************** Future Buy limit order function End  ********************/

  /************** Future Buy StopLimit order function Start  ********************/
  static futureBuyStoplimitOrder = async (data) => {
    console.log(data);
    let { futureBuyTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: data.price,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureBuyTrade.create(buyTradeData)

  }
  /************** Future Buy StopLimit order function End  ********************/

  /************** Future buy market order function Start  ********************/
  static futureBuymarketOrder = async (data) => {
    let { futureBuyTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    var symbol = await this.getPair(data.tradepair_id)
    console.log('symbol1==' + symbol);
    if (symbol == null) {
      return symbol
    }
    var liveprice = await helper.getLivePrice(symbol);
    console.log("liveprice===" + liveprice);
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: liveprice,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureBuyTrade.create(buyTradeData)
  }

  /************** Future buy market order function End  ********************/

  /************** Future  sell order function start  ********************/

  static sellFutureTrade = async (req, res) => {
    console.log('okay');
    try {
      //console.log(User);
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        res.json(error1('Unauthorized User', 400))
        return;
      }
      req.body.userid = token.id
      let tradepair_id = req.body.tradepair_id;
      var symbol = await this.getPair(tradepair_id)
      req.body.symbol = symbol
      if (req.body.trade_type == 1) {
        var FutureSelllimitOrder = await this.futureSelllimitOrder(req.body)
          .then(FutureSelllimitOrderSuccess => {
            res.json(success('Future Sell Limit Trade Place Successfully', FutureSelllimitOrderSuccess, 200))
            return
          })
          .catch(FutureSelllimitOrderError => {
            res.json(error1(FutureSelllimitOrderError.message, 400))
            return
          })

      }
      if (req.body.trade_type == 3) {
        var FutureStopSelllimitOrder = await this.FutureStopSelllimitOrder(req.body)
          .then(FutureStopSelllimitOrderSuccess => {
            res.json(success('Future Stop Limit Sell Trade Place Successfully', FutureStopSelllimitOrderSuccess, 200))
            return
          })
          .catch(FutureStopSelllimitOrderError => {
            res.json(error1(FutureStopSelllimitOrderError.message, 400))
            return
          })

      }
      if (req.body.trade_type == 2) {
        var futureSellmarketOrder = await this.futureSellmarketOrder(req.body)
          .then(futureSellmarketOrder => {
            if (futureSellmarketOrder == null) {
              res.json(error('Trade Pair Not Found', 400))
              return
            }
            else {
              res.json(success('Future Sell Market Trade Place Successfully', futureSellmarketOrder, 200))
              return
            }

          })
          .catch(futureSellmarketOrderError => {
            res.json(error(futureSellmarketOrderError.mesage, 400))
            return
          })
      }

    } catch (error) {
      res.json(error(error.mesage, 400))
      return
    }

  }
  /************** Future Limit sell order function start  ********************/

  static futureSelllimitOrder = async (data) => {
    let { futureSellTrade }= await createDB1Manager();
    console.log(data);
    const trade_id = crypto.randomBytes(16).toString("hex");
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: data.price,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureSellTrade.create(buyTradeData)

  }
  /************** Future sell Limit order function End  ********************/

  /************** Future Stop Limit sell order function start  ********************/
  static FutureStopSelllimitOrder = async (data) => {
    let { futureSellTrade }= await createDB1Manager();
    console.log(data);
    const trade_id = crypto.randomBytes(16).toString("hex");
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: data.price,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureSellTrade.create(buyTradeData)

  }

  /************** Future Stop Limit Sell Order Function End ***********************/
  /************** Future sell Limit  Order Function Start ***********************/
  static futureSellmarketOrder = async (data) => {
    let { futureSellTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    var symbol = await this.getPair(data.tradepair_id)
    console.log('symbol==' + symbol);
    if (symbol == null) {
      return symbol
    }
    var liveprice = await helper.getLivePrice(symbol)
    console.log("liveprice===" + liveprice);
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
      marginal_type: data.marginal_type,
      price: liveprice,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      commission: data.commission,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      status: data.status,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price
    }
    return futureSellTrade.create(buyTradeData)
  }
  /************** Future sell market Order Function End ***********************/
  // FutureSell Trade function end
  static getPair = async (id) => {
    let { TradePairs }= await createDB1Manager();
    return new Promise(async function (resolve, reject) {
      let getTrade = await TradePairs.findOne({ where: { id: id } })
      var tradePair;
      if (getTrade) {
        tradePair = getTrade.coin_one + '' + getTrade.coin_two;
      } else {
        tradePair = null;
      }
      resolve(tradePair)
    });

  }


  /************** get all transaction ***********************/
  // transaction start
  static getTransactions = async (req, res) => {
    try {
      let { Transaction }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let transactions = await Transaction.findAll({ where: req.query })
      return res.json(success('all transaction Successfully', transactions, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }


  /************** add transaction ***********************/
  // transaction start
  static addTransactions = async (req, res) => {
    try {
      let { Transaction }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token==" + token);
      if (!token) {
        return res.json(error('Unauthorized User', 400))
      }
      let lastTransaction = await Transaction.findOne({order: [ [ 'createdAt', 'DESC' ]]});
      let obj = req.body;
      if(lastTransaction) {
        obj['impactCoinBps'] = parseFloat(lastTransaction.coinBps) > parseFloat(obj.coinBps) ? 'increase' : 'decrease';
        obj['impactCoinValue'] = parseFloat(lastTransaction.coinValue) > parseFloat(obj.coinValue) ? 'increase' : 'decrease';
        obj['impactShareValue'] = parseFloat(lastTransaction.shareValue) > parseFloat(obj.shareValue) ? 'increase' : 'decrease';
      }
      else {
        obj['impactCoinBps'] = 'NI';
        obj['impactCoinValue'] = 'NI';
        obj['impactShareValue'] = 'NI';
      }
      let transactions = await Transaction.create(req.body)
      return res.json(success('Transaction added Successfully', transactions, 200))
    }
    catch (err) {
      return res.json(error(err.mesage, 500))
    }
  }

}

module.exports = {
  futuretradeController,
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