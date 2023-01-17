const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const { createDB1Manager } = require('../models');
const axios = require('axios')

const query_string = 'timestamp=1578963600000';
const apiSecret = 'LyOK2hfEnkAo8LAq1qSJo0l5Zs';
// const apiSecret = 'IMpVLs34CEJ9mnadIzYXqzeyFK90mLYs94UTuRSMPxGCwTerszwrKBsLtUPjFjPv';
const apiKey= 'KD3uTxUcV1h0xWaPaHTaiMen76M'

class cexController {

    static generateSignature(query_string) {
        return crypto
            .createHmac('sha256', apiSecret)
            .update(query_string)
            .digest('hex');
    }


    static getCurrencyLimit = async (req,res) => {
        try {
            var currencyLimitList = await axios({
                method: "get",
                url: `https://cex.io/api/currency_limits`
            })
            res.send(currencyLimitList.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
        
    }


    static getLastPrice = async (req,res) => {
        try {
            let lastPriceList = await axios({
                method: "get",
                url: `https://cex.io/api/last_price/${req.params.symbol1}/${req.params.symbol2}`
            })
            // return productList.data;
            res.send(lastPriceList.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
    }

    static convertSymbol = async (req,res) => {
        try {
            const inputBody = {
                "amnt": req.query.amount
            };
            const headers = {
            'Content-Type':'application/json',
            'Accept':'*/*'
            };
            var getConvertData = await axios.post(`https://cex.io/api/convert/${req.query.symbol1}/${req.query.symbol2}`,inputBody,headers)
            res.send(getConvertData.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
    }
//Last prices for given markets

    static getLastPriceGivenMarket = async (req,res) => {
        try {
            let lastPriceList = await axios({
                method: "get",
                url: `https://cex.io/api/last_prices/${req.params.symbol1}/${req.params.symbol2}/${req.params.symbol3}`
            })
            res.send(lastPriceList.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
        
    }

    static getChart = async (req,res) => {
        try {
            const inputBody = {
                "lastHours": 24,
                "maxRespArrSize": 100
            };
            
            const headers = {
            'Content-Type':'application/json',
            'Accept':'*/*'
            };
            var getChartData = await axios.post(`https://cex.io/api/price_stats/${req.query.symbol1}/${req.query.symbol2}`,inputBody,headers)
            res.send(getChartData.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
    }
    static getMyFee = async (req,res) => {
        try {
            let getTime= new Date().getTime();
            let query_string= `${getTime}up157947669KD3uTxUcV1h0xWaPaHTaiMen76M`;
            let signature= this.generateSignature(query_string)
            let body= {
                "key": apiKey,
                "signature": signature,
                "nonce":getTime
              }
              const headers = {
                'Content-Type':'application/json',
                'Accept':'*/*'
              };
            var currencyLimitList = await axios.post(`https://cex.io/api/get_myfee`,body,headers)
            res.send(currencyLimitList.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
        
    }

    static getCryptoAddress = async (req,res) => {
        try {
            let getTime= new Date().getTime();
            let query_string= `${getTime}up157947669KD3uTxUcV1h0xWaPaHTaiMen76M`;
            let signature= this.generateSignature(query_string)
            let body= {
                "key": apiKey,
                "signature": signature,
                "nonce":getTime,
                "currency": "BTC"
              }
              const headers = {
                'Content-Type':'application/json',
                'Accept':'*/*'
              };
            var getAddressList = await axios.post(`https://cex.io/api/get_address`,body,headers)
            res.send(getAddressList.data)
        }
        catch(err) {
            console.log(err)
            res.send(err)
        }
        
    }
    // static getSteckingProductList = async (req,res) => {
    //     try {
    //         let query_string= `product=${'STAKING'}&timestamp=${new Date().getTime()}`
    //         console.log(`https://api.binance.com/sapi/v1/staking/productList?${this.generateSignature(query_string)}`)
    //         var productList = await axios({
    //             method: "get",
    //             url: `https://api.binance.com/sapi/v1/staking/productList?product=${'STAKING'}&timestamp=${new Date().getTime()}&signature=${this.generateSignature(query_string)}`,
    //             headers: {
    //                 "X-MBX-APIKEY": "xGM11m3npKELpHGLQpBaTDw9NHePT3VQa8inLBx7Kitu3N3hMv4fLdskzB9T5a4b"
    //             },
    //         })
    //         // return productList.data;
    //         res.send(productList.data)
    //     }
    //     catch(err) {
    //         console.log(err)
    //         res.send(err)
    //     }
        
    // }


}


module.exports = {
    cexController
}