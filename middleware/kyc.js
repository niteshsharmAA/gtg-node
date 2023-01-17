// const multer = require('multer');
const express=require('express')
const app=express();
var fileupload = require("express-fileupload");
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
var path = require('path');
const { success, error, validation } = require('../middleware/responseApi')
const { helper } = require('../helper/helper')
dotenv.config();

const aadharFileVerification = async (request, response, next) => {
    try {
        var bodyFormData = new FormData();
        var originalname = request.files.aadhar_doc.name;
        var file =request.files.aadhar_doc;
        var path = './uploads/kyc/aadhar/';
        // var fileName = await helper.fileUpload(originalname,file,path);
        console.log(path + originalname);
        file.mv(path + originalname);
        bodyFormData.append('files', fs.createReadStream(path+originalname));
        // console.log('bodyFormData',bodyFormData);
        // axios({
        //   method: "post",
        //   url: process.env.AADHAR_FILE_VERIFICATION_URL,
        //   headers: { 
        //     "Content-Type": "multipart/form-data",
        //     "X-API-Key": process.env.DOCSUMO_FILE_API_KEY
        //  },
        //  data: bodyFormData
        // })
        // .then(function (res) {
        //   response.json(success( 'Aadhar file verified successfully',null,200))
        // })
        // .catch(function (err) {
        //   console.log(err)
        //   //handle error
        //   response.json(error( 'Aadhar file not verified',400))
        // });
        } catch (errorTry) {
          console.log('errorTry',errorTry)
          response.json(error( errorTry,400))
        }

}

const drivingLicenseVerification = async (request, response, next) => {
    try {
      const token = await helper.validToken('check', request.headers.authorization, null)
      if (!token) {    
        response.json(error('Unauthorized User',400))
        return;
      }
      var bodyFormData = new FormData();
      var originalname = request.files.driving_doc.name;
      var file =request.files.driving_doc;
      let file_buffer = new Buffer(file.data)
      bodyFormData.append('files', file_buffer, { filename : originalname });
        axios({
          method: "post",
          url: process.env.DRIVING_LICENSE_VERIFICATION_URL,
          headers: { 
            "Content-Type": "multipart/form-data",
            "X-API-Key": process.env.DOCSUMO_FILE_API_KEY
         },
         data: bodyFormData
        })
        .then(async function (res) {
          if(res){
          var path = 'uploads/kyc/driving_license/';
          var fileName = await helper.fileUpload(originalname,file,path);
          if(fileName){
          var updateDoc = await helper.documentUpdate(fileName,'driving_license',token.id);
          if(updateDoc){
            response.json(success( 'Driving License file verified successfully',fileName,200))
          }
         }
        }
        })
        .catch(function (errorRes) {
          //handle error
          response.json(error( 'Driving License file not verified',400))
        });
          
        } catch (error) {
          console.log(error);
        }

}


const passportVerification = async (request, response, next) => {
  try {
    var bodyFormData = new FormData();
    var originalname = request.files.passport_doc.name;
    var file =request.files.passport_doc;
    var path = './uploads/kyc/passport/';
    var fileName = await helper.fileUpload(originalname,file,path);
    bodyFormData.append('files', fs.createReadStream(path+fileName));
      axios({
        method: "post",
        url: process.env.PASSPORT_FILE_VERIFICATION_URL,
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-API-Key": process.env.DOCSUMO_FILE_API_KEY
       },
       data: bodyFormData
      })
      .then(function (res) {
        response.json(success( 'Passport verified successfully',null,200))
      })
      .catch(function (error) {
        //handle error
        response.json(error( 'Passport not verified',400))
      });
        
      } catch (error) {
        console.log(error);
      }
}


const pancardVerification = async (request, response, next) => {
  try {
    var bodyFormData = new FormData();
    var originalname = request.files.pancard_doc.name;
    var file =request.files.pancard_doc;
    var path = './uploads/kyc/pancard/';
    var fileName = await helper.fileUpload(originalname,file,path);
    bodyFormData.append('files', fs.createReadStream(path+fileName));
      axios({
        method: "post",
        url: process.env.PANCARD_FILE_VERIFICATION_URL,
        headers: { 
          "Content-Type": "multipart/form-data",
          "X-API-Key": process.env.DOCSUMO_FILE_API_KEY
       },
       data: bodyFormData
      })
      .then(function (res) {
        response.json(success( 'Pancard verified successfully',null,200))
      })
      .catch(function (error) {
        //handle error
        response.json(error( 'Pancard not verified',400))
      });
        
      } catch (error) {
        console.log(error);
      }
}


  module.exports = {
    aadharFileVerification,
    drivingLicenseVerification,
    passportVerification,
    pancardVerification
  }