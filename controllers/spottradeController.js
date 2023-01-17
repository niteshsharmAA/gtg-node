const Binance = require('node-binance-api');
const { createDB1Manager } = require('../models');
const crypto = require('crypto')
const { helper } = require('../helper/helper')
const { signature } = require('../helper/siganture')
const axios = require('axios')
const { success, error, validation } = require('../middleware/responseApi');
const { stat } = require('fs');
const { getTestMessageUrl } = require('nodemailer');
const res = require('express/lib/response');
const req = require('express/lib/request');
const binance = new Binance().options({
  APIKEY: 'hae7pJNy8H1tz7Cnz727SMivUdPisRG7CpZTKli4LIoKWukbZUR5S1YBOoMw2DEw',
  APISECRET: '1q0hehPRN0deWBfM2oSK2ZAipwfViFP5laTkGg82jGkMp4kk0m4Id5T88kshrstk'
});
// const User = db.user;
// const tradepair = db.tradepair
// const spotbuytrade = db.spotbuytrade
// const spotselltrade = db.spotselltrade
// const buytrade = db.buytrade
//const sellfutureTrade = db.futureselltrade;



class spottradeController {

   /********User Spot Sell/Buy Trade function start *******/
   static spotUserOrderBook = async (req, res) => {
    try {
      
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      var order_data = {};
      const user_id = token.id
      console.log('user_id=' + user_id);
      const tradepair_id = req.body.tradepair_id;
      var spotUserBuyOrderBook = await this.spotUserBuyOrderBook(user_id, tradepair_id)
      var spotUserSellOrderBook = await this.spotUserSellOrderBook(user_id, tradepair_id);

      if(spotUserBuyOrderBook==''){

        console.log('spotUserBuyOrderBook blanck hai')
      }

      if(spotUserSellOrderBook==''){

        console.log('spotUserSellOrderBook blanck hai')
      }
      if (spotUserBuyOrderBook != '' && spotUserSellOrderBook != "") {

        order_data['spotBuyData'] = spotUserBuyOrderBook;
        order_data['spotSellData'] = spotUserSellOrderBook;
        res.json(success('Spot User Order List', order_data, 200))
        return

      }else if(spotUserBuyOrderBook=="" && spotUserSellOrderBook != ""){

        order_data['spotBuyData'] = [];
        order_data['spotSellData'] = spotUserSellOrderBook;
        res.json(success('Spot User Order List', order_data, 200))
        return

      }else if(spotUserBuyOrderBook != '' && spotUserSellOrderBook == ""){

        order_data['spotBuyData'] = spotUserBuyOrderBook;
        order_data['spotSellData'] = [];
        res.json(success('Spot User Order List', order_data, 200))
        return  

      }else{

        order_data['spotBuyData'] = [];
        order_data['spotSellData'] = [];
        res.json(success('Spot User Order List', order_data, 200))
        return
      }

    } catch (error) {
      console.log('here=='+error)
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /********User Spot Sell/Buy Trade function End *******/

  /********User Spot buy data list *******/
  static spotUserBuyOrderBook = async (user_id, tradepair_id) => {
    let { spotBuyTrade }= await createDB1Manager();
    var condition = tradepair_id ? { uuid: user_id, tradepair_id: tradepair_id } : { uuid: user_id }
    return spotBuyTrade.findAll({ where: condition })
      .then(spotBuyData => {
        console.log('spotBuyData=='+spotBuyData);
        return spotBuyData
      })
      .catch(spotBuyDataError => {
        res.json(error(spotBuyDataError.message, 400))
      })

  }
  /********User Spot Buy Trade  order list function End *******/

  /********User Spot Sell data list *******/
  static spotUserSellOrderBook = async (user_id, tradepair_id) => {
    let { spotSellTrade }= await createDB1Manager();
    var condition = tradepair_id ? { uuid: user_id, tradepair_id: tradepair_id } : { uuid: user_id }
    return spotSellTrade.findAll({ where: condition })
      .then(spotSellData => {
        console.log('spotSellData=='+spotSellData);
        return spotSellData
      })
      .catch(spotSellDataError => {
        res.json(error(spotSellDataError.message, 400))
      })

  }
  /********User Spot Sell Trade  order list function End *******/

  /********User Spot buy/sell open order data list *******/
  static spotUserOpenOrderBook = async (req, res) => {
    try {
      let { spotBuyTrade ,spotSellTrade}= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      var order_data = {};
      var order_array = [];
      var tradepair_id = req.body.tradepair_id;
      const user_id = token.id
      var condition = tradepair_id ? { uuid: user_id, tradepair_id: tradepair_id, status: 0 } : { uuid: user_id, status: 0 }
      spotBuyTrade.findAll({ where: condition })
        .then(spotBuyData => {
          spotSellTrade.findAll({ where: condition })
            .then(spotSellData => {

              order_data['spotBuyOpenData'] = spotBuyData;
              order_data['spotSellOpenData'] = spotSellData;

              res.json(success('User Open Order List Found', order_data, 200))
            })
            .catch(futureSellDataError => {
              res.json(error(futureSellDataError.message, 400))
            })

        })
        .catch(futureSellDataError => {
          res.json(error(futureSellDataError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /********User Spot Sell/Buy Trade open order function End *******/

  /********User Spot Sell/Buy Trade info function start *******/
  static spotUserOrderDetails = async (req, res) => {
    try {
      let { spotBuyTrade,spotSellTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      var order_data = {};
      var order_array = [];
      const user_id = token.id
      spotBuyTrade.findAll({ where: { trade_id: req.body.trade_id } })
        .then(spotBuyData => {
          if (spotBuyData != '') {
           // console.log('spot buy data');
            res.json(success('Buy Order Details', spotBuyData, 200))
            return
          } else {

            spotSellTrade.findAll({ where: { trade_id: req.body.trade_id } })
              .then(spotSellData => {

                if (spotSellData != '') 
                {
                  //console.log('spot sell data');
                  res.json(success('Sell Order Details', spotSellData, 200))
                  return
                } else {
                  res.json(success('No Order Found', spotSellData, 200))
                  return
                }

                //res.json(success('Sell Order Details', spotSellData, 200))
              })
              .catch(futureSellData1Error => {
                console.log(futureSellData1Error);
                res.json(error(futureSellData1Error.message, 400))
              })
          }


        })
        .catch(futureSellDataError => {
          console.log(futureSellDataError);
          res.json(error(futureSellDataError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })
      // res.json(error(error,400))
    }

  }

  /******** Buy open order cancel function start ****************/
  static buyOpenOrderCancel = async (user_id) => {
    let { spotBuyTrade }= await createDB1Manager();
    const open_order = 0;
    const cancel_order = 2;
    const cancelBuyOrder = [];
    const buySellTradeCancelData = {
      status: 2,
    }
    return spotBuyTrade.findOne({ where: { uuid: user_id, status: open_order } })
      .then(foundBuyOrder => {

        if (foundBuyOrder != '') {

          return spotBuyTrade.update(buySellTradeCancelData, { where: { uuid: user_id, status: open_order } })
            .then(buyOpenOrderCancel => {


              return spotBuyTrade.findAll({ where: { uuid: user_id, status: 2 } })
                .then(cancelBuyOrderData => {

                  return cancelBuyOrderData;
                })

            })

        } else {

          return spotBuyTrade.findAll({ where: { uuid: user_id, status: 2 } })
            .then(cancelBuyOrderData => {
              return cancelBuyOrderData;
            })

        }

      })

  }

  /********User Spot Sell/Buy Trade info function End *******/
  /******** Spot Buy Trade Cancel Order start *******/

  static spotBuyOrderCancel = async (req, res) => {
    try {
      let { spotBuyTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const trade_order_id = req.body.trade_id;

      const user_id = token.id;
      const buyTradeCancelData = {
        status: 2,
      }
      const foundOrder = await spotBuyTrade.findOne({ where: { trade_id: trade_order_id } })
        .then(foundOrder => {
          spotBuyTrade.update(buyTradeCancelData, { where: { trade_id: trade_order_id } })
            .then(buyTradeCancelData => {
              if (buyTradeCancelData == 1) {
                const cancelOrderData = spotBuyTrade.findOne({ where: { trade_id: trade_order_id } })
                  .then(cancelOrderData => {

                    res.json(success('Order Cancel Sucessfully', cancelOrderData, 200))
                  })
              } else {

                res.json(error('Some Error Occured', 400))
              }
            })


        })
        .catch(CancelOrderError => {
          res.json(error(CancelOrderError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /******** Spot Buy Trade Cancel Order End *******/
  /******** Spot Sell Trade Cancel Order start *******/

  static spotSellOrderCancel = async (req, res) => {
    try {
      let { spotSellTrade }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      const trade_order_id = req.body.trade_id;

      const user_id = token.id;
      const sellTradeCancelData = {
        status: 2,
      }
      const foundOrder = await spotSellTrade.findOne({ where: { trade_id: trade_order_id } })
        .then(foundOrder => {
          spotSellTrade.update(sellTradeCancelData, { where: { trade_id: trade_order_id } })
            .then(sellTradeCancelData => {
              if (sellTradeCancelData == 1) {
                const cancelOrderData = spotSellTrade.findOne({ where: { trade_id: trade_order_id } })
                  .then(cancelOrderData => {

                    res.json(success('Order Cancel Sucessfully', cancelOrderData, 200))
                  })
              } else {

                res.json(error('Some Error Occured', 400))
              }
            })

        })
        .catch(CancelOrderError => {
          res.json(error(CancelOrderError.message, 400))
        })
    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }

  /******** Spot Buy Trade Cancel Order End *******/

  /******** Spot Buy/sell Trade Cancel all open Order Start *******/
  static spotBuySellOpenOrderCancel = async (req, res) => {
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }

      const user_id = token.id;
      const open_order = 0;
      const cancel_order = 2;
      var foundBuyOrderData = '';
      var foundSellOrderData = '';
      var cancelorder_data = {}; // empty Object
      const buySellTradeCancelData = {
        status: 2,
      }
      const buyOpenOrderCancel = await this.buyOpenOrderCancel(user_id);
      const sellOpenOrderCancel = await this.sellOpenOrderCancel(user_id);
      if (buyOpenOrderCancel != '' && sellOpenOrderCancel != '') {

        cancelorder_data['buy_open_order_cancel'] = buyOpenOrderCancel;
        cancelorder_data['sell_open_order_cancel'] = sellOpenOrderCancel;
        res.json(success('Spot all open order cancel successfully.', cancelorder_data, 200))

      }else if (buyOpenOrderCancel == '' && sellOpenOrderCancel != '') {

        cancelorder_data['buy_open_order_cancel'] = [];
        cancelorder_data['sell_open_order_cancel'] = sellOpenOrderCancel;
        res.json(success('Spot all open order cancel successfully.', cancelorder_data, 200))  
      
      }else if (buyOpenOrderCancel != '' && sellOpenOrderCancel == '') {

        cancelorder_data['buy_open_order_cancel'] = buyOpenOrderCancel;
        cancelorder_data['sell_open_order_cancel'] = [];
        res.json(success('Spot all open order cancel successfully.', cancelorder_data, 200))  

      }else{

        cancelorder_data['buy_open_order_cancel'] = [];
        cancelorder_data['sell_open_order_cancel'] = [];
        res.json(success('No Order found for cancel.', cancelorder_data, 200)) 
      }

    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }
  /******** Spot Buy/sell Trade Cancel all open Order End *******/
  /******** Buy open order cancel function start ****************/
  static buyOpenOrderCancel = async (user_id) => {
    let { spotBuyTrade }= await createDB1Manager();
    const open_order = 0;
    const cancel_order = 2;
    const cancelBuyOrder = [];
    const buySellTradeCancelData = {
      status: 2,
    }
    return spotBuyTrade.findOne({ where: { uuid: user_id, status: open_order } })
      .then(foundBuyOrder => {

        if (foundBuyOrder != '') {

          return spotBuyTrade.update(buySellTradeCancelData, { where: { uuid: user_id, status: open_order } })
            .then(buyOpenOrderCancel => {


              return spotBuyTrade.findAll({ where: { uuid: user_id, status: 2 } })
                .then(cancelBuyOrderData => {

                  return cancelBuyOrderData;
                })

            })

        } else {

          return spotBuyTrade.findAll({ where: { uuid: user_id, status: 2 } })
            .then(cancelBuyOrderData => {
              return cancelBuyOrderData;
            })

        }

      })

  }

  /******** Buy open order cancel function End *******/
  /******** Buy open order cancel function start ****************/
  static sellOpenOrderCancel = async (user_id) => {
    let { spotSellTrade }= await createDB1Manager();
    const open_order = 0;
    const cancel_order = 2;
    const cancelBuyOrder = [];
    const buySellTradeCancelData = {
      status: 2,
    }
    return spotSellTrade.findOne({ where: { uuid: user_id, status: open_order } })
      .then(foundSellOrder => {

        if (foundSellOrder != '') {

          return spotSellTrade.update(buySellTradeCancelData, { where: { uuid: user_id, status: open_order } })
            .then(buySellTradeCancelData => {

              return spotSellTrade.findAll({ where: { uuid: user_id, status: 2 } })
                .then(cancelSellOrderData => {
                  return cancelSellOrderData;
                })

            })
        } else {
          return spotSellTrade.findAll({ where: { uuid: user_id, status: 2 } })
            .then(cancelSellOrderData => {
              return cancelSellOrderData;
            })
        }


      })

  }
  /******** Buy open order cancel function End *******/

  /******** Spot Buy Trade postion list function start *******/

  static buySpottrade = async (req, res) => {
    //console.log(req);
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token=="+token);
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      req.body.userid = token.id
      let tradepair_id = req.body.tradepair_id;
      var symbol = await this.getPair(tradepair_id)
      req.body.symbol = symbol
      if (req.body.trade_type == 1) {
        var limitOrder = await this.limitOrder(req.body)
          .then(limitOrderSuccess => {
            res.json(success('Limit Buy Trade Place Successfully', limitOrderSuccess, 200))
            return
          })
          .catch(limitOrderError => {
            res.json(error(limitOrderError.message, 400))
            return
          })

      }
      if (req.body.trade_type == 2) {
        var marketOrder = await this.marketOrder(req.body)
          .then(marketOrder => {
            if (marketOrder == null) {
              res.json(error('Trade Pair Not Found', 400))
              return
            }
            else {
              res.json(success('Market Buy Trade Place Successfully', marketOrder, 200))
              return
            }

          })
          .catch(marketOrderError => {
            console.log(marketOrderError);
            res.json(error(marketOrderError.mesage, 400))
            return
          })
      }

    } catch (error1) {
      res.json(error(error1.mesage, 400))
      return
    }

  }

  static limitOrder = async (data) => {
    let { spotBuyTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    console.log('data.userid='+data.userid);
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
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
    return spotBuyTrade.create(buyTradeData)

  }

  static marketOrder = async (data) => {
    let { spotBuyTrade }= await createDB1Manager();
    const trade_id = crypto.randomBytes(16).toString("hex");
    var symbol = await this.getPair(data.tradepair_id)
    if (symbol == null) {
      return symbol
    }
    //var liveprice = await helper.getLivePrice(symbol)

    var liveprice = await helper.getLivePrice('BTC', 'USD')
    console.log('liveprice=='+liveprice);
    var getSignatureData = this.getsignature()
    
    const buyTradeData = {
      uuid: data.userid,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_id: trade_id,
      trade_type: data.trade_type,
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
  
    return spotBuyTrade.create(buyTradeData)
  }



  static sellSpottrade = async (req, res) => {
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      req.body.uuid = token.id
      req.body.trade_id = crypto.randomBytes(16).toString("hex");
      let tradepair_id = req.body.tradepair_id;
      var symbol = await this.getPair(tradepair_id)
      req.body.symbol = symbol
      if (req.body.trade_type == 1) {
        var LimitSellTrade = this.LimitSellTrade(req.body)
          .then(LimitSellTradeSuccess => {
            res.json(success('Limit Sell Trade Place Successfully !', LimitSellTradeSuccess, 200))
            return;
          })
          .catch(LimitSellTradeError => {
            res.json(success(LimitSellTradeError.message, 400, null))
            return;
          })
      }
      else {
        var MarketSellTrade = this.MarketSellTrade(req.body)
          .then(MarketSellTradeSuccess => {
            if (MarketSellTrade == null) {
              res.json(error('Trade Pair Not Found', 400))
              return
            }
            else {
              res.json(success('Market Sell Trade Place Successfully', MarketSellTradeSuccess, 200))
              return
            }
          })
          .catch(MarketSellTradeError => {
            res.json(success(MarketSellTradeError.message, 400, null))
            return;
          })
      }
    } catch (error) {
      res.json(error(error.message, res.statusCode))
      return;
    }

  }

  static LimitSellTrade = async (data) => {
    let { spotSellTrade }= await createDB1Manager();
    const sellTradeData = {
      uuid: data.uuid,
      trade_id: data.trade_id,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_type: data.trade_type,
      price: data.price,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      commission: data.commission,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price,
      status: data.status
    }
    return spotSellTrade.create(sellTradeData)
  }

  static MarketSellTrade = async (data) => {
    let { spotSellTrade }= await createDB1Manager();
    var symbol = await this.getPair(data.tradepair_id)
    var liveprice = await helper.getLivePrice(symbol)
    const sellTradeData = {
      uuid: data.uuid,
      trade_id: data.trade_id,
      tradepair_id: data.tradepair_id,
      symbol: data.symbol,
      trade_type: data.trade_type,
      price: liveprice,
      quantity: data.quantity,
      trade_total_value: data.trade_total_value,
      after_commission_total: data.after_commission_total,
      executed_quantity: data.executed_quantity,
      remaining_amount: data.remaining_amount,
      commission: data.commission,
      stop_loss_price: data.stop_loss_price,
      target_price: data.target_price,
      status: data.status
    }
    return spotSellTrade.create(sellTradeData)
  }

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

  /********User Get Trade Pair list data *******/
  static traidPairData = async (req, res) => {
    try {
      let { TradePairs }= await createDB1Manager();
     
      TradePairs.findAll()
        .then(tradePairData => {

          res.json(success('TradePair Data List', tradePairData, 200))
          return

        })
        .catch(tradePairDataError => {
          res.json(error(tradePairDataError.message, 400))
        })

    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }

//    /********User Get signature *******/
//    static getsignature = async (req, res) => {
//     try {
//       //let { TradePairs }= await createDB1Manager();
//       let signatre = await signature.getSignatureData();
//       //console.log(signatre.);
//       res.json(success('Signature', signatre, 200))

//     } catch (error) {
//       res.json({ mesage: error.message, statusCode: 400 })

//     }

//   }
 

//   static buyTradeData = async (req,res) => {

//     process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//     let getSignatureData = await signature.getSignatureData();
//     let getLastPrice = await this.getLastPrice(req.body.symbol1, req.body.symbol2);
//     console.log('getLastPrice=='+getLastPrice);
//     try {
//         const inputBody = {
          
//             "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//             "signature": getSignatureData.signature,
//             "nonce": getSignatureData.getTime,
//             "order_type": req.body.order_type,
//             "type": req.body.type,
//             "amount": req.body.amount,
//             "price": getLastPrice.lprice,
//             "maker_only": false
//         };
//         const headers = {
//         'Content-Type':'application/json',
//         'Accept':'/'
//         };
//         var placeOrder = await axios.post(`https://cex.io/api/place_order/${req.body.symbol1}/${req.body.symbol2}`,inputBody,headers)
        
//         res.send(placeOrder.data)
//     }
//     catch(err) {
//         console.log(err)
//         res.send(err)
//     }
// }

// // Get Order Details

// static tradeOrderDetails = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
//   console.log(getSignatureData);
 
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
//           "id": req.body.id
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var getOrderDetails = await axios.post(`https://cex.io/api/get_order/`,inputBody,headers)
//       if(getOrderDetails){
//         res.json(success('Trade Order Details', getOrderDetails, 200))
//         return
//       }else{
//         res.json(success('No Trade Order Found', getOrderDetails, 200))
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Get Order Transaction Details

// static tradeOrderTransactionDetails = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
//           "id": req.body.id
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var transactDetails = await axios.post(`https://cex.io/api/get_order_tx/`,inputBody,headers)
//       if(transactDetails){
//         res.send(transactDetails)
//         return
//       }else{

//         res.send("No Transaction")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Open Order Details

// static openOrderList = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var openOrderData = await axios.post(`https://cex.io/api/open_orders/`,inputBody,headers)
//       if(openOrderData){
//        let opeOrderList= [
//           {
//             "id": "13837040",
//             "time": "1460020144872",
//             "type": "sell",
//             "price": "411.626",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "EUR"
//           },
//           {
//             "id": "16452929",
//             "time": "1462355019816",
//             "type": "buy",
//             "price": "400",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "USD"
//           }
//         ]
//         res.json(success('Open Order List', opeOrderList, 200))
//         //res.send(opeOrderList)
//         return
//       }else{

//         res.send("No Open Order")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Open Pair Order Details

// static openPairOrderList = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var openPairOrderData = await axios.post(`https://cex.io/api/open_orders/${req.body.symbol1}/${req.body.symbol2}`,inputBody,headers)
//       if(openPairOrderData){
//        let opeOrderList= [
//           {
//             "id": "13837040",
//             "time": "1460020144872",
//             "type": "sell",
//             "price": "411.626",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "EUR"
//           },
//           {
//             "id": "16452929",
//             "time": "1462355019816",
//             "type": "buy",
//             "price": "400",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "USD"
//           }
//         ]
//         res.json(success('Open Order Pair List', opeOrderList, 200))
//         //res.send(opeOrderList)
//         return
//       }else{

//         res.send("No Open Order")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Open Orders By Symbol

// static openSymbolOrderList = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var openSymbolOrderData = await axios.post(`https://cex.io/api/open_orders/${req.body.symbol1}`,inputBody,headers)
//       if(openSymbolOrderData){
//        let opeOrderList= [
//           {
//             "id": "13837040",
//             "time": "1460020144872",
//             "type": "sell",
//             "price": "411.626",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "EUR"
//           },
//           {
//             "id": "16452929",
//             "time": "1462355019816",
//             "type": "buy",
//             "price": "400",
//             "amount": "1.00000000",
//             "pending": "1.00000000",
//             "symbol1": "BTC",
//             "symbol2": "USD"
//           }
//         ]
//         res.json(success('Open Order Pair List', opeOrderList, 200))
//         //res.json(success('OK', cancelPairOrder.data, 200))
//         //res.send(opeOrderList)
//         return
//       }else{

//         res.send("No Open Order")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Cancel Order using order ID

// static cancelOrder = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
//           "id": req.body.id
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var cancelOrder = await axios.post(`https://cex.io/api/cancel_order/`,inputBody,headers)
//       if(cancelOrder){
//         console.log(cancelOrder.data);
//         res.json(success('OK', cancelOrder.data, 200))
//         //res.send(cancelOrder)
//         return
//       }else{

//         res.send("No Order found")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Archive order ID

// static archiveOrder = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
//           "limit": req.body.limit,
//           "dateTo": req.body.dateTo,
//           "dateFrom": req.body.dateFrom,
//           "lastTxDateTo": req.body.lastTxDateTo,
//           "lastTxDateFrom": req.body.lastTxDateFrom,
//           "status": req.body.status
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var archiveOrder = await axios.post(`https://cex.io/api/archived_orders/${req.body.symbol1}/${req.body.symbol2}`,inputBody,headers)
//       if(archiveOrder){
//         console.log(archiveOrder.data);
//         res.json(success('OK', archiveOrder.data, 200))
//         //res.send(cancelOrder)
//         return
//       }else{

//         res.send("No Order found")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Mass Cancel Order

// static massCancelOrder = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//     const inputBody = {
//       "cancel-orders": [
//         "1987",
//         "1278"
//       ],
//       "place-orders": [
//         {
//           "pair": [
//             "BTC",
//             "USD"
//           ],
//           "amount": 0.02,
//           "price": "4200",
//           "order_type": "limit",
//           "type": "buy"
//         }
//       ],
//       "cancelPlacedOrdersIfPlaceFailed": false
//     };
//     const headers = {
//       'Content-Type':'application/json',
//       'Accept':'application/json'
//     };
//       var cancelPlaceOrder = await axios.post(`https://cex.io/api/mass_cancel_place_orders`,inputBody,headers)
//       if(cancelPlaceOrder){
//         console.log(cancelPlaceOrder.data);
//         res.json(success('OK', cancelPlaceOrder.data, 200))
//         //res.send(cancelOrder)
//         return
//       }else{

//         res.send("No Order found")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }


// // Cancel All Orders using pair

// static cancelPairOrder = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime
          
       
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var cancelPairOrder = await axios.post(`https://cex.io/api/cancel_orders/${req.body.symbol1}/${req.body.symbol2}`,inputBody,headers)
//       if(cancelPairOrder){
//         //console.log(cancelPairOrder);
//         let cancelPair = {
//           "e": "cancel_orders",
//           "ok": "ok",
//           "data": [
//             "2407314",
//             "2407317",
//             "2407320",
//             "2407323"
//           ]
//         }
//         console.log('datalegth='+cancelPairOrder.data.data.legth);
//         console.log(cancelPair.data.length);
//         //res.json(success('Pair Order Cancel Sucessfully', cancelPairOrder, 200))
//         res.json(success('OK', cancelPairOrder.data, 200))
//         //res.send(cancelPairOrder.data)
//         return
//       }else{

//         res.send("No Order found")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }

// // Active Order State
// static activeOrder = async (req,res) => {

//   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//   let getSignatureData = await signature.getSignatureData();
  
//   try {
    
//       const inputBody = {
        
//           "key": "KD3uTxUcV1h0xWaPaHTaiMen76M",
//           "signature": getSignatureData.signature,
//           "nonce": getSignatureData.getTime,
//           "id": req.body.id,
//           "orders_list": req.body.orders_list
//       };
//       const headers = {
//       'Content-Type':'application/json',
//       'Accept':'/'
//       };
//       var orderStatus = await axios.post(`https://cex.io/api/active_orders_status`,inputBody,headers)
//       if(orderStatus){
//         console.log(orderStatus.data);
//         res.json(success('OK', orderStatus.data, 200))
//         //res.send(cancelOrder)
//         return
//       }else{

//         res.send("No Order found")
//         return
//       }
      
//   }
//   catch(err) {
//       console.log(err)
//       res.send(err)
//   }
// }


//   static getLastPrice = async (symbol1,symbol2) => {
   
//     console.log('getLastPrice');
//     process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//     try {
//         let lastPriceList = await axios({
//             method: "get",
//             url: `https://cex.io/api/last_price/${symbol1}/${symbol2}`
//         })
//         return lastPriceList.data.lprice;
//         //res.send(lastPriceList.data)
//     }
//     catch(err) {
//         console.log(err)
//         res.send(err)
//     }
// }

//    /********User Get signature *******/
//    static getLivePrice = async (req, res) => {
//     try {
//       //let { TradePairs }= await createDB1Manager();
//       let liveprice = await helper.getLivePrice('BTC', 'USD');
//       //console.log(signatre.);
//       res.json(success('Signature', liveprice, 200))

//     } catch (error) {
//       res.json({ mesage: error.message, statusCode: 400 })

//     }

//   }


}

module.exports = {
  spottradeController,
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