const jwt=require('jsonwebtoken')
const { createDB1Manager } = require('../models');
const CC = require('./convert')
// const livePriceCoin = db.liveCoinPrice;
// const Documents = db.document;
const nodemailer = require("nodemailer")
var path = require('path');
const fs = require('fs');
const axios = require('axios')
const multer = require('multer');
const sgmail = require('@sendgrid/mail')
const API_KEY = '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'
const AWS = require('aws-sdk');
const dotenv=require('dotenv').config()
sgmail.setApiKey(API_KEY)
class helper{
    static userExists = async(type,data) => {
      const { User } = await createDB1Manager();
        if(type=='email_id'){
            const result = await User.count({where : { 'email_id' : data }})
            return result;
        }
        if(type=='mobile_number'){
            const result = await User.count({where : { 'mobile_number' : data }})
            return result;
        }
    }; 

    static AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }
      static validToken=async(status,token,id,cb)=>{
        try{
          if(status==='generate'){
              const result= await jwt.sign({id:id},process.env.ENCRYPT_DECRYPT_SECRET_KEY)
              return result
          }

          if(status==='check'){
            const { User } = await createDB1Manager();
            var authToken;
            if (token && token.split(" ")[0] === "Bearer") {
              authToken = token.split(" ")[1];
            }else{
              authToken = null;
            }
              const result = await jwt.decode(authToken,process.env.ENCRYPT_DECRYPT_SECRET_KEY)
              const getUserDetails = await User.findOne({where:{uuid:result.id}});
              if(getUserDetails){
                return { id:getUserDetails.uuid};
              }else{
                return false;
              }
              
          }
      }catch(err){
        throw err;
      }

    }

    static sendmail = async(getParams) => 
    {
      
      const message = {
        to : getParams.to,
        from : 'vigneshprabusuccess22@gmail.com',
        subject : getParams.subject,
        templateId : 'd-3f2b037f4d884775be4b2eca2b721f5d',
        dynamicTemplateData : {
          login_otp : getParams.login_otp
        }
      }
      if(type=='mobile_number'){
          const result = await User.count({where : { 'mobile_number' : data }})
          return result;
      }
  }; 

  static AddMinutesToDate(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
  }
    static validToken=async(status,token,id,cb)=>{
      if(status==='generate'){
          const result= await jwt.sign({id:id},process.env.ENCRYPT_DECRYPT_SECRET_KEY)
          return result
      }

      if(status==='check'){
        var authToken;
        if (token && token.split(" ")[0] === "Bearer") {
          authToken = token.split(" ")[1];
        }else{
          authToken = null;
        }
          const result=await jwt.decode(authToken,process.env.ENCRYPT_DECRYPT_SECRET_KEY)
          return result;
      }

  }

  static sendmail = async(getParams) => 
  {
    
    const message = {
      to : getParams.to,
      from : 'vigneshprabusuccess22@gmail.com',
      subject : getParams.subject,
      templateId : 'd-3f2b037f4d884775be4b2eca2b721f5d',
      dynamicTemplateData : {
        login_otp : getParams.login_otp
      }
    }
    
      await sgmail.send(message)
      .then(Success =>  {
      return true
      })
      .catch(Error => {
        return false
      })
  }

  static fileUpload = async(originalName,file,filePath) =>{

  const s3 = new AWS.S3({
    accessKeyId:  process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  });
      var extension = path.extname(originalName);
      var file_name = new Date().getTime() + extension;
      let buf = new Buffer(file.data)
      
      // Setting up S3 upload parameters
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePath+file_name, // File name you want to save as in S3
        Body: buf,
        CreateBucketConfiguration: {
          LocationConstraint: "ap-south-1"
        },
        ACL: 'public-read'
      };
      
      // Uploading files to the bucket
    return new  Promise( async function (resolve, reject) {
        s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        // console.log('data',data)
        resolve (data.Location);
        // console.log(`File uploaded successfully. ${data.Location}`);
    });
    });
  }

  static documentUpdate = async(fileName,type,uid) => {
    let data ={
        uid:uid,
        'type':type,
        'name':type,
        'doc_image':fileName
      }
      const result = await Documents.create(data);
      if(result){
        return true
      }else{
        return false
      }
  }; 

  static insertLiveCurrency = async (currency) => {
    var livecurrencyprice = await axios({
      method: "get",
      url: `https://api.binance.com/api/v3/ticker/price?symbol=${currency}`,
    })
    return livecurrencyprice.data;
  }
  static swapFeeCalculate = async (swapData) =>{
    const { liveCoinPrice } = await createDB1Manager();
    // const getPrice = await liveCoinPrice.findOne({where:{currencyname:`${swapData.quoteasset}USDT`}});
    // let price = new CC({from:swapData.quoteasset, to:swapData.baseasset, amount:+1, isDecimalComma:true})
    // const single = await price.convert();

    const inputBody = {
      "amnt": `${swapData.fromcurrency}`
    }
    var livepricedata = await axios({
      method: "post",
      url: `https://cex.io/api/convert/${swapData.quoteasset}/${swapData.baseasset}`,
      data:inputBody,
    })
    console.log('livepricedata',livepricedata.data);
    const num = livepricedata.data.amnt * swapData.fromcurrency;

    //fee calculation
    let swapFee = +swapData.fromcurrency * 0.15/100;
    let swapFeeRebate = swapFee*45/100;
    let getBnbAmount = new CC({from:swapData.quoteasset, to:'BNB', amount:+swapFeeRebate, isDecimalComma:true})
    const swapFeeRebatefinal = await getBnbAmount.convert();

    const data = {
      // swapId:swapData.swapId,
      quoteasset:swapData.quoteasset,
      baseasset:swapData.baseasset,
      fromcurrency:swapData.fromcurrency,
      fee:swapFee,
      swapfeerebate:swapFeeRebatefinal,
      slippage:0.00007245,
      swaprewards:swapFeeRebatefinal,
      tocurrency:+num,
      price:+livepricedata.data.amnt,
      claimedstatus:false
    };
    return data;
  }
  static getLivePrice = async(symbol) =>
  {
    console.log(symbol)
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    var livepricedata = await axios({
      method: "get",
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    })
    return livepricedata.data.price
  }
  // static requestLogger = async (req, response) => {
  //   let { User,userRequestLogger }= await createDB1Manager();
  //   const token = await this.validToken('check', req.headers.authorization, null);
  //   console.log('token',token);
  //   let userData=null;
  //   if(token){
  //     userData = await User.findOne({where:{uuid:token.id}});
  //   }
    
  //   let insertObj = {
  //     uuid:userData?.uuid,
  //     req_method:req.method,
  //     req_url:req.url,
  //     response:response,
  //     request_payload:req.method ==='GET' ? req.query:req.body
  //   }
  //   const chkSave = await userRequestLogger.create(insertObj);
  //   return;
  // }
};



module.exports={helper}