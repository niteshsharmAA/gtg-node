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

const apiKey= 'KD3uTxUcV1h0xWaPaHTaiMen76M'
// const User = db.user;
// const tradepair = db.tradepair
// const spotbuytrade = db.spotbuytrade
// const spotselltrade = db.spotselltrade
// const buytrade = db.buytrade
//const sellfutureTrade = db.futureselltrade;



class tradeOrderController {

  /********User Spot Sell/Buy Trade function start *******/


  /********User Get signature *******/
  static getsignature = async (req, res) => {
    try {
      //let { TradePairs }= await createDB1Manager();
      let signatre = await signature.getSignatureData();
      //console.log(signatre.);
      res.json(success('Signature', signatre, 200))

    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }

  /********  Buy/Sell Trade postion list function start *******/

  static buySellTradeData = async (req, res) => {
    //console.log(req.body.symbol1);
    //console.log(req);
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      console.log("token=="+token);
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      req.body.userid = token.id
    
        var tradeOrder = await this.buySellTrade(req.body)
          .then(tradeOrderSuccess => {
            res.json(success('Trade Order Placed Sucessfully', tradeOrderSuccess, 200))
            return
          })
          .catch(limitOrderError => {
            res.json(error(limitOrderError.message, 400))
            return
          })
    } catch (error1) {
      res.json(error(error1.mesage, 400))
      return
    }
    
  }
  
  /********  Buy/Sell Trade postion list function End *******/
 
  static buySellTrade = async (data) => {
    //console.log(data);
    //let { tradeOrder }= await createDB1Manager();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();
    console.log('data.symbol1=='+data.symbol1);
    let getLastPrice = await this.getLastPrice(data.symbol1, data.symbol2);
    console.log('getLastPrice==' + getLastPrice);
    try {
      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "order_type": data.order_type,
        "type": data.type,
        "amount": data.amount,
        "price": getLastPrice.lprice,
        "maker_only": false
      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var placeOrder = await axios.post(`https://cex.io/api/place_order/${data.symbol1}/${data.symbol2}`, inputBody, headers)
      const TradeData = {
        uuid: data.userid,
        symbol1: data.symbol1,
        symbol2: data.symbol1,
        trade_id: 0,
        order_type: data.order_type,
        trade_type: data.type,
        status: '0',
        complete: false,
        price: getLastPrice.lprice,
        amount: data.amount,
        pending_amount: data.amount,
        status: data.status,
        stop_loss_price: data.stop_loss_price,
        target_price: data.target_price
      }
      //return tradeOrder.create(TradeData)
      //tradeOrder.create(TradeData)
      return placeOrder.data;
      //res.send(placeOrder.data)
    }
    catch (err) {
      console.log(err)
      return err
      //res.send(err)
    }
  }

  // Get Order Details

  static tradeOrderDetails = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();
    console.log(getSignatureData);

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "id": req.body.id

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var getOrderDetails = await axios.post(`https://cex.io/api/get_order/`, inputBody, headers)
      if (getOrderDetails) {
        res.json(success('Trade Order Details', getOrderDetails, 200))
        return
      } else {
        res.json(success('No Trade Order Found', getOrderDetails, 200))
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Get Order Transaction Details

  static tradeOrderTransactionDetails = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "id": req.body.id

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var transactDetails = await axios.post(`https://cex.io/api/get_order_tx/`, inputBody, headers)
      if (transactDetails) {
        res.send(transactDetails)
        return
      } else {

        res.send("No Transaction")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Open Order Details

  static openOrderList = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var openOrderData = await axios.post(`https://cex.io/api/open_orders/`, inputBody, headers)
      if (openOrderData) {
       
        res.json(success('Open Order List', openOrderData.data, 200))
        //res.send(opeOrderList)
        return
      } else {

        res.send("No Open Order")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Open Pair Order Details

  static openPairOrderList = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var openPairOrderData = await axios.post(`https://cex.io/api/open_orders/${req.body.symbol1}/${req.body.symbol2}`, inputBody, headers)
      if (openPairOrderData) {
    
        res.json(success('Open Order Pair List', openPairOrderData.data, 200))
        //res.send(opeOrderList)
        return
      } else {

        res.send("No Open Order")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Open Orders By Symbol

  static openSymbolOrderList = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var openSymbolOrderData = await axios.post(`https://cex.io/api/open_orders/${req.body.symbol1}`, inputBody, headers)
      if (openSymbolOrderData) {
        
        res.json(success('Open Order Pair List', openSymbolOrderData.data, 200))
        //res.json(success('OK', cancelPairOrder.data, 200))
        //res.send(opeOrderList)
        return
      } else {

        res.send("No Open Order")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Cancel Order using order ID

  static cancelOrder = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "id": req.body.id

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var cancelOrder = await axios.post(`https://cex.io/api/cancel_order/`, inputBody, headers)
      if (cancelOrder) {
        console.log(cancelOrder.data);
        res.json(success('OK', cancelOrder.data, 200))
        //res.send(cancelOrder)
        return
      } else {

        res.send("No Order found")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Archive order ID

  static archiveOrder = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "limit": req.body.limit,
        "dateTo": req.body.dateTo,
        "dateFrom": req.body.dateFrom,
        "lastTxDateTo": req.body.lastTxDateTo,
        "lastTxDateFrom": req.body.lastTxDateFrom,
        "status": req.body.status

      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var archiveOrder = await axios.post(`https://cex.io/api/archived_orders/${req.body.symbol1}/${req.body.symbol2}`, inputBody, headers)
      if (archiveOrder) {
        console.log(archiveOrder.data);
        res.json(success('OK', archiveOrder.data, 200))
        //res.send(cancelOrder)
        return
      } else {

        res.send("No Order found")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Mass Cancel Order

  static massCancelOrder = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {
        "cancel-orders": [
          "1987",
          "1278"
        ],
        "place-orders": [
          {
            "pair": [
              "BTC",
              "USD"
            ],
            "amount": 0.02,
            "price": "4200",
            "order_type": "limit",
            "type": "buy"
          }
        ],
        "cancelPlacedOrdersIfPlaceFailed": false
      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      var cancelPlaceOrder = await axios.post(`https://cex.io/api/mass_cancel_place_orders`, inputBody, headers)
      if (cancelPlaceOrder) {
        console.log(cancelPlaceOrder.data);
        res.json(success('OK', cancelPlaceOrder.data, 200))
        //res.send(cancelOrder)
        return
      } else {

        res.send("No Order found")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }


  // Cancel All Orders using pair

  static cancelPairOrder = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime


      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var cancelPairOrder = await axios.post(`https://cex.io/api/cancel_orders/${req.body.symbol1}/${req.body.symbol2}`, inputBody, headers)
      if (cancelPairOrder) {
        //console.log(cancelPairOrder);
      
        //res.json(success('Pair Order Cancel Sucessfully', cancelPairOrder, 200))
        res.json(success('OK', cancelPairOrder.data, 200))
        //res.send(cancelPairOrder.data)
        return
      } else {

        res.send("No Order found")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  // Active Order State
  static activeOrder = async (req, res) => {

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let getSignatureData = await signature.getSignatureData();

    try {

      const inputBody = {

        "key": apiKey,
        "signature": getSignatureData.signature,
        "nonce": getSignatureData.getTime,
        "id": req.body.id,
        "orders_list": req.body.orders_list
      };
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '/'
      };
      var orderStatus = await axios.post(`https://cex.io/api/active_orders_status`, inputBody, headers)
      if (orderStatus) {
        console.log(orderStatus.data);
        res.json(success('OK', orderStatus.data, 200))
        //res.send(cancelOrder)
        return
      } else {

        res.send("No Order found")
        return
      }

    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }


  static getLastPrice = async (symbol1, symbol2) => {

    console.log('getLastPrice');
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    try {
      let lastPriceList = await axios({
        method: "get",
        url: `https://cex.io/api/last_price/${symbol1}/${symbol2}`
      })
      //console.log(lastPriceList);
      return lastPriceList.data.lprice;
      //res.send(lastPriceList.data)
    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  /********User Get signature *******/
  static getLivePrice = async (req, res) => {
    try {
      //let { TradePairs }= await createDB1Manager();
      let liveprice = await helper.getLivePrice('BTC', 'USD');
      //console.log(signatre.);
      res.json(success('Signature', liveprice, 200))

    } catch (error) {
      res.json({ mesage: error.message, statusCode: 400 })

    }

  }


}

module.exports = {
  tradeOrderController,
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