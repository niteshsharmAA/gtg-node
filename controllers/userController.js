const { createDB1Manager } = require('../models');
const axios = require('axios');
const session = require('express-session');
const { helper } = require('../helper/helper')
const encryption = require('../middleware/encryption')
const { success, error, validation } = require('../middleware/responseApi')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const { country } = require("../models");
const nodemailer = require("nodemailer");
const { json } = require("express/lib/response")
const sgmail = require('@sendgrid/mail')
const API_KEY = process.env.sendGridAppId;
sgmail.setApiKey(API_KEY)
const jwt = require('jsonwebtoken');
// const client = require('twilio')(process.env.twilioAppId, process.env.twilioScretKey)
const FormData = require('form-data');
const {Op} = require('sequelize');

const logger = require('../logger');

let LOG_ID = 'controller/userController';

class UserController {
  // validation
  static validation = async (req, res) => {
    try{
      let { User }= await createDB1Manager();
      if (req.body.email_id) {
        const existsUser = await User.count({ where: { email_id: req.body.email_id } })
        if (existsUser) {
          res.status(400).json(error(req.body.email_id + " Email already exist!", 400))
        } else {
          res.json(success("Email new one!", null, res.statusCode))
        }

      }
      if (req.body.mobile_number) {
        const existsUser = await User.count({ where: { mobile_number: req.body.mobile_number } })
        if (existsUser) {
          res.status(400).json(error(req.body.mobile_number + " Mobile number already exist!", 400))
        } else {
          res.json(success("Mobile number new one!", null, res.statusCode))
        }

      }
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }

  // Create and Save a new User
  static signup = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/signup`)

      let { User }= await createDB1Manager();
      if (req.body.email_id == "" || req.body.mobile_number == "") {
        res.status(400).json(error("email or mobile number can not be empty!", 400));
        return;
      }
      if (!req.body.reg_type) {
        res.status(400).json(error("type can not be empty!", 400));
        return;
      }
      var existsUser = await helper.userExists((req.body.reg_type == 1) ? 'email_id' : 'mobile_number', (req.body.reg_type == 1) ? req.body.email_id : req.body.mobile_number)
      // const otp = Math.floor(100000 + Math.random() * 900000)
      const otp = 123456;
      if (existsUser == 0) {
        let registerData = {};
        if (req.body.reg_type == 1) {
          var sendMailData = await {
            to: req.body.email_id,
            subject: 'One Time Login Password',
            login_otp: otp

          }
          // var sendMail = await helper.sendmail(sendMailData)
          registerData = {
            email_id: req.body.email_id,
            login_otp: otp,
            user_type: 1,
            user_role:'USR',
            password: encryption.encrypt(req.body.password)
          };
        }

        if (req.body.reg_type == 2) {

          registerData = {
            mobile_number: req.body.mobile_number,
            // phone_otp: otp,
            // login_otp: otp,
            phone_otp: 123456,
            login_otp: 123456,
            // expiration_time:expiration_time,
            user_type: 2,
            user_role:'USR',
            password: encryption.encrypt(req.body.password)
          };
        }
        
        //  Create a User
        //  Save User in the database
        User.create(registerData)
          .then(async data => {
            var token = await helper.validToken('generate', null, data.uuid);
            let resData = {
              'email_id': data.email_id,
              'mobile_number': data.mobile_number,
              'username': data.username,
              'user_type': data.user_type,
              'email_verify': data.email_verify,
              'phone_verify': data.phone_verify,
              'token': token
            }
            res.json(success("OK. user added successfully.", resData, res.statusCode));
          })
          .catch(err => {
            res.status(400).json(error(err.message, 400))
          });

      } else {
        res.status(400).json(error("User Already Exists", 400));
      }
    } catch (err) {
      res.status(400).json(error(err.message, 400))
    }
  };

  static resendMailOTP = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/resendMailOTP`)

      let { User }= await createDB1Manager();
      console.log(req.headers.authorization)
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }

      User.findOne({
        where: { uuid: token.id },
      })
        .then(userData => {
          if (userData == null) {
            res.status(400).json(error('User Details Not Found', 400))
          }

          var otp = Math.floor(100000 + Math.random() * 900000)
          var updateData = {
            login_otp: otp
          }

          var sendMailData = {
            to: userData.email_id,
            subject: 'One Time Login Password',
            login_otp: otp

          }
          helper.sendmail(sendMailData)
          User.update(updateData, { where: { uuid: token.id }, })
            .then(updateData => {
              if (updateData == 1) {
                res.status(400).json(success('Successfully OTP Send Your Register Mail !', null, res.statusCode))
              }
            })
        })
        .catch(userDataError => {
          res.status(400).json(error(userDataError.message, 400))
        })
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }

  static mailVerify = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/mailVerify`)

      let { User }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      if (token.id == "" || req.body.login_otp == "") {
        res.status(400).json(error("Id are login otp can not be empty!", 400));
        return;
      }

      User.findOne({
        where: { uuid: token.id },
      })
      .then(userData => {
        if (userData.status == 1) {
          res.status(400).json(error('Your Account Already Veirified', 400))
          return
        }
        if (req.body.login_otp == userData.login_otp) {
          var updateData = {
            login_otp: null,
            email_verify: 1,
            status: 1
          }

          User.update(updateData, { where: { uuid: token.id }, })
            .then(updateResult => {
              if (updateResult == 1) {
                res.json(success('Your Account Verified Successfully', null, 200))
              }
              else {
                res.status(400).json(error('Some Error Occured', 400))
              }
            })

        }
        else {
          res.status(400).json(error('Invalid E-Mail OTP Try Again !', 400))
        }
        // res.json(success('',userData,200))
      })
      .catch(userDataError => {
        res.status(400).json(error('User Details Not Found', 400))
      })
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }

  // static resendOTP = async (req,res) => {
  //     try {

  //       if (req.body.phone =="" || req.body.id =="" ) {
  //         res.json(error("Id Are Phone Number Can Not Be Empty!", res.statusCode));
  //         return;
  //       }
  //       var otp = Math.floor(100000 + Math.random() * 900000)
  //       var data = {
  //         phone_otp : otp
  //       }

  static resendOTP = async (req, res) => {
    logger.info(`${LOG_ID}/resendOTP`)
    try {
      let { User }= await createDB1Manager();
      var email_id = req.body.email_id;
      var mobile_number = req.body.mobile_number;
      // var otp = Math.floor(100000 + Math.random() * 900000)
      var otp = 123456
      if (mobile_number == "" && email_id == "") {
        res.status(res.statusCode).json(error("Mobile Number or Email ID Can't be empty!", res.statusCode));
        return;
      }
      else if (mobile_number != "" && email_id == "") {
        const data = {
          phone_otp: otp
        }
        const user = await User.findOne({ where: { mobile_number: req.body.mobile_number } });
        if (user) {
          await User.update(data, { where: { mobile_number: req.body.mobile_number } })
          res.json(success('Otp Send Your Register Mobile Number. kindly check', data, res.statusCode))
        } else {
          res.status(res.statusCode).json(error("Mobile number does't exist", res.statusCode))
        }
      } else if (email_id != "" && mobile_number == "") {
        const data = {
          login_otp: otp
        }
        const user1 = await User.findOne({ where: { email_id: req.body.email_id } })
        if (user1) {
          await User.update(data, { where: { email_id: req.body.email_id } })
          res.json(success('Otp Send Your Register Mail Id. Kindly check', data, res.statusCode))
        } else {
          res.status(res.statusCode).json(error("Email ID does't exist", res.statusCode))
        }
      } else {
        res.status(400).json(error("Kindly share valid data!", 400));
        return;
      }
    } catch (errors) {
      res.status(res.statusCode).json(error(errors.message, res.statusCode))
    }
  }

  static verifyPhoneOtp = async (req, res) => {
    logger.info(`${LOG_ID}/verifyPhoneOtp`)
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      let { User }= await createDB1Manager();
      if (req.body.phone == "" || req.body.otp == "") {
        res.status(400).json(error("Id,Phone Number Are OTP Field can not be empty!", 400));
        return;
      }
      let userData= await User.findOne({
        where: { uuid: token.id },

      })
      if (userData && userData.status == 1) {
        res.json(success('Account Already Verified', null, 400))
        return;
      }
      if (userData.phone_otp == req.body.otp) {

        var data = {
          phone_otp: null,
          phone_verify: 1,
          status: 1
        }
        User.update(data, { where: { uuid: token.id }})
        res.json(success("Account Verified Successfully !", userData, res.statusCode));
        return;
      }
      else {
        res.status(400).json(error('Invalid Otp Try Again !', 400))
        return;
      }
    } catch (errors) {
      res.status(400).json(error(errors.message, 400))
    }
  }




  ///////****************2FA Mobile******************////////////
  static disable_mobile_2fa = async (req, res) => {
    try {
      
      logger.info(`${LOG_ID}/disable_mobile_2fa`)
      let { User }= await createDB1Manager();
      User.findOne({
        where: { id: req.body.id }
      }).then(data => {
        if (data) {
          if (data.two_fa_email_otp == req.body.twofa_email_otp) {
            var data = {
              mobile_auth_2fa: 0,
              mobile_2fa_otp: null
            }
            User.update(data, { where: { id: req.body.id }, })
              .then(result => {
                res.json(success("Mobile 2FA Disabled Successfully!", null, res.statusCode))
              })
          } else {
            res.status(400).json(error("OTP is wrong!", 400))
          }
        } else {
          res.status(400).json(error("User not found", 400))
        }
      })

    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }

  }



  static login = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/login`)

      let { User,Session }= await createDB1Manager();
      const email_id = req.body.email_id;
      let user = {};
      if (email_id)
        user = await User.findOne({ where: { email_id: req.body.email_id } });
      else
        user = await User.findOne({ where: { mobile_number: req.body.mobile_number } });
      if (user) {
        if (encryption.decrypt(user.password) !== req.body.password) {
          res.status(400).json(error('Incorrect password.', 400))
          return
        } else {
          var token = await helper.validToken('generate', null, user.uuid);
          const sess_token = req.session.id;
          const result = await Session.count({ where: { 'uuid': user.uuid } })
          let sessionData = {};
          if (result == 0) {
            sessionData = {
              session_id: sess_token,
              token: token,
                uid: user.id,
              uuid: user.uuid,
              status: "1"
            };
            let createSession = await Session.create(sessionData)
            if (createSession) {
              let resData = {
                'email_id': user.email_id,
                'mobile_number': user.mobile_number,
                'username': user.username,
                'user_type': user.user_type,
                'email_verify': user.email_verify,
                'phone_verify': user.phone_verify,
                'token': token
              }
              res.json(success("Login Successfully", resData, res.statusCode))
            } else {
              res.status(400).json(error("Login Failed, please check credentials", 400))
            }
          } else {
            sessionData = {
              session_id: sess_token,
              token: token,
              uid: user.id,
              uuid: user.uuid,
              status: "1"
            };
            let updateSession = await Session.update(sessionData, { where: { uuid: user.uuid } })
            if (updateSession) {
              let resData = {
                'email_id': user.email_id,
                'mobile_number': user.mobile_number,
                'username': user.username,
                'user_type': user.user_type,
                'email_verify': user.email_verify,
                'phone_verify': user.phone_verify,
                'token': token
              }
              res.json(success("Login Successfully", resData, res.statusCode))
            } else {
              res.status(400).json(error("Login Failed, please check credentials", 400))
            }
          }
        }
      } else {
        res.status(400).json(error('Login credentials does not matched', 400))
      }
    }catch(err){
      res.status(400).json(error(err.message, 400))
    }
  };

  // // Retrieve all User from the database.
  static getUser =async (req, res) => {
    try{
      logger.info(`${LOG_ID}/getUser`)
      let { User }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      console.log('token',token);
      User.findOne({ where: { uuid: token.id } })
        .then(data => {
          res.json(success("Get Specific User", data, res.statusCode));
        })
        .catch(err => {
          res.status(400).json(error(err.message || "Some error occurred while retrieving user.", 400))
        });
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  };


  // // Retrieve all User from the database.
  static getAllUsers = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/getAllUsers`)
      let { User }= await createDB1Manager();
      User.findAll()
        .then(data => {
          res.json(success("Get All User", data, res.statusCode));
        })
        .catch(err => {
          res.status(400).json(error(err.message || "Some error occurred while retrieving user.", 400))
        });
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  };



// // Update avatar.
  static updateUserAvatar = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/updateUserAvatar`)
      let { User }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      User.update({avatar : req.body.avatar}, {where: { uuid: token.id },})
        .then(data => {
          res.json(success("Avatar updated successful", data, 200));
        })
        .catch(err => {
          res.json(error(err.message || "Some error occurred while updating avatar.", 400))
        });
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  };




  static sendmail = async (req, res) => {
    try{
      logger.info(`${LOG_ID}/sendmail`)

      const message = {
        to: 'sathishdkofficial@gmail.com',
        from: 'vigneshprabusuccess22@gmail.com',
        subject: 'Test Subject 15-12-22',
        templateId: 'd-3f2b037f4d884775be4b2eca2b721f5d',
        dynamicTemplateData: {
          login_otp: '123456'
        }
      }
      sgmail.send(message)

        .then(sendmailResponse => {
          res.json({ mailStatus: 'Email Sent ' + sendmailResponse })
        })
        .catch(mailSendError => {
          res.json({ mailSendError: mailSendError.message })
        })
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }

  // static updateProfileDetails = async (req, res) => {
  //   try {
  //     Address.findOne({
  //       where: { uuid: req.body.uid }
  //     })
  //       .then(userData => {
  //         if (userData == null) {

  //           res.json(error('No User Found', 400))
  //         }
  //         if (userData != null) {
  //           var updateDatas = {
  //             d_no: req.body.dno,
  //             address_1: req.body.address_1,
  //             address_2: req.body.address_2,
  //             address_3: req.body.address_3,
  //             country_id: req.body.country_id,
  //             state_id: req.body.state_id,
  //             dist: req.body.dist,
  //             pincode: req.body.pincode,
  //             uuid: req.body.uid
  //           }
  //           Address.update(updateDatas, { where: { uuid: req.body.uid }, })
  //             .then(updateDataSuccess => {
  //               res.json({ message: 'update  successfully' })
  //             })
  //             .catch(updateDataError => {
  //               res.json({ message: updateDataError.message })
  //             })
  //         }
  //       })
  //       .catch(userDataError => {
  //         res.json({ record: userDataError.message })
  //       })

  //   } catch (error) {
  //     res.json(error(error.message, 400))
  //   }
  // }


  static updateProfileDetails = async (req, res) => {
    logger.info(`${LOG_ID}/updateProfileDetails`)
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      let { User,Address,userProfile }= await createDB1Manager();
      let userDetails = await userProfile.findOne({
        where: { uuid: token.id }
      });
      let data= req.body;
      if(userDetails){
        await userProfile.update(data,{where: { id: userDetails.id }});
        userDetails = await userProfile.findOne({
          where: { uuid: token.id }
        });
      }else{
        data.uuid= token.id
        userDetails=  await userProfile.create(data);
      }
      await User.update({ username: data.fullName },{ where: { uuid: token.id }});
      res.json(success('update  successfully!', userDetails, 200))
    } catch (err) {
      console.log('err',err);
      res.json(error(err.message, 400))
    }
  }
  static ChangePassword = async (req, res) => {
    logger.info(`${LOG_ID}/ChangePassword`)
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }

      let { User }= await createDB1Manager();
      const old_password = req.body.old_password
      const new_password = encryption.encrypt(req.body.new_password)
      const confirm_new_password = req.body.confirm_new_password

      User.findOne({
        where: { uuid: token.id }
      }).then(data => {
        // if( data.google_auth_2fa == 0 ){
        //   res.status(400).json({ success : false, message : "Please verify 2FA Authentication", data : null })
        // }else{

        // }
        if (data) {
          if (encryption.decrypt(data.password) == req.body.old_password) {
            if (encryption.decrypt(new_password) == confirm_new_password) {
              const updatePassword = {
                password: new_password
              }
              User.update(updatePassword, { where: { id: data.id }, })
                .then(updatedata => {
                  res.json(success('Password reset successfully!', null, res.statusCode))
                }).catch(err => {
                  res.status(400).json(error('Some error occur try again later', 400))
                })
            } else {
              res.status(400).json(error('Confirm new Password does not match', 400))
            }

          } else {
            res.status(400).json(error('Old Password is wrong', 400))
          }
        }
      })

    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }

  static aadharValidator = async (req, res) => {
    logger.info(`${LOG_ID}/aadharValidator`)

    try {
      let { User,Verification }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
        var bodyFormData = new FormData();
        var originalname = req.files.aadhar_doc.name;
        var file =req.files.aadhar_doc;
        var path = './uploads/kyc/aadhar/';
        // var fileName = await helper.fileUpload(originalname,file,path);
        console.log(path + originalname);
        file.mv(path + originalname);
        let verificationData= {
          uuid:token.id,
          doc_image:originalname,
          doc:0
        }
        let data1 = await User.findOne({ uuid:token.id });
        console.log('data1 users',data1.id);
        let data = await Verification.create(verificationData);
      res.json(success('Validate successfully!', req.file, res.statusCode))
    } catch (error) {
      console.log(error);
    }

  };
  static kycVerification = async (req, res) => {
    logger.info(`${LOG_ID}/kycVerification`)

    try {
      let { User,Verification }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
        let checkVerification = await Verification.findOne({where: { uuid : token.id, doc_type: req.body.doc_type } });
        if(checkVerification){
          res.status(400).json(error('These details already exits', 400))
          return;
        }
        var originalname = req.files.doc_image.name;
        var file =req.files.doc_image;
        var path = `uploads/kyc/${req.body.doc_type}/`;
        var fileName = await helper.fileUpload(originalname,file,path);
        let userVerify= {};
        let fileName1 = '';
        if(req.body.doc_type=='aadhar'){
          userVerify.aadhar_verify =  1;
          let originalname1 = req.files.doc_image1.name;
          let file1 =req.files.doc_image1;
          let path1 = `uploads/kyc/${req.body.doc_type}/`;
          fileName1 = await helper.fileUpload(originalname1,file1,path1);

        }
        if(req.body.doc_type=='pancard'){
          userVerify.pan_verify =  1
        }
        if(req.body.doc_type=='user_image'){
          userVerify.user_image_verify =  1
        }
        let verificationData= {
          uuid:token.id,
          doc_image:fileName,
          doc_image1:fileName1,
          doc_type:req.body.doc_type,
          doc_name:req.body.doc_name
        }
        let data = await Verification.create(verificationData);
        await User.update(userVerify, { where: { uuid: token.id } });
      res.json(success('Validate successfully!', data, res.statusCode))
    } catch (err) {
      // console.log(error);
      res.status(400).json(error(err.message, 400))
    }

  };
  static getKycVerificationDetails = async (req, res) => {
    logger.info(`${LOG_ID}/getKycVerificationDetails`)
    try {
      let { Verification }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      let data = await Verification.findAll({ where: { uuid: token.id } });
      res.json(success("Get User Verification Details", data, res.statusCode));
    } catch (err) {
      // console.log(error);
      res.status(400).json(error(err.message, 400))
    }

  };
  static drivingLicenseValidator = (req, res) => {
    logger.info(`${LOG_ID}/drivingLicenseValidator`)
    try {
      res.json(success('Validate successfully!', req.file, res.statusCode))
    } catch (error) {
      console.log(error);
    }

  };

  static passportValidator = (req, res) => {
    logger.info(`${LOG_ID}/passportValidator`)
    try {
      res.json(success('Validate successfully!', req.file, res.statusCode))
    } catch (error) {
      console.log(error);
    }

  };

  static pancardValidator = (req, res) => {
    try {
      logger.info(`${LOG_ID}/pancardValidator`)

      res.json(success('Validate successfully!', req.file, res.statusCode))
    } catch (error) {
      console.log(error);
    }

  };

  static pancardValidation = async (req, res) => {
    logger.info(`${LOG_ID}/pancardValidation`)
    try {
      var bodyFormData = new FormData();
      var fileName = req.files.photo.name
      var file = req.files.photo
      var extension = path.extname(fileName);
      var file_name = new Date().getTime() + extension;
      file.mv("./uploads/" + file_name, (err, result) => {
        bodyFormData.append('files', fs.createReadStream("./uploads/" + file_name))
        axios({
          method: "post",
          url: process.env.PANCARD_FILE_VERIFICATION_URL,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": process.env.KYC_API_KEY
          },
          data: bodyFormData
        })
          .then(function (response) {
            res.json(success('Pan Card verified successfully', null, res.statusCode))
          })
          .catch(function (errorResponse) {
            res.status(400).json(error('Pan Card verified not verified  Upload Correct Image', 400))
          });
      })

    } catch (err) {
      res.status(400).json(error(err.message, 400))
    }

  }

  static passportValidation = async (req, res) => {
    logger.info(`${LOG_ID}/passportValidation`)
    try {
      var bodyFormData = new FormData();
      var fileName = req.files.photo.name
      var file = req.files.photo
      var extension = path.extname(fileName);
      var file_name = new Date().getTime() + extension;
      file.mv("./uploads/" + file_name, (err, result) => {
        bodyFormData.append('files', fs.createReadStream("./uploads/" + file_name))
        axios({
          method: "post",
          url: process.env.PASSPORT_FILE_VERIFICATION_URL,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": process.env.KYC_API_KEY
          },
          data: bodyFormData
        })
          .then(function (response) {
            res.json(success('passport verified successfully', null, res.statusCode))
          })
          .catch(function (errorResponse) {
            res.status(400).json(error(errorResponse, 400))
          });
      })

    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  }



  // Log out.
  static logout = async (req, res) => {
    try{
      const token = await helper.validToken('check', req.headers.authorization, null)
        if (!token) {
          res.json(error('Unauthorized User', 400))
          return;
        }
      logger.info(`${LOG_ID}/logout`)

      let { Session }= await createDB1Manager();
      let sessionData = {
        session_id: null,
        token: null,
        status: "0"
      };
      Session.update(sessionData, { where: { uuid: token.id } })
        .then(data => {
          req.session.destroy(() => {
            res.json(success('logout successfully', null, res.statusCode))
          });
        })
        .catch(err => {
          res.status(400).json(error(err.message || "Some error occurred while creating the User.", 400))
        });
    } catch (error) {
      res.status(400).json(error(error.message, 400))
    }
  };

  static ForgotPassword = async (req, res) => {
    logger.info(`${LOG_ID}/ForgotPassword`)
    try {
      let { User }= await createDB1Manager();
      const username = req.body.username;
      const email_id = req.body.email_id;
      const mobile_number = req.body.mobile_number;
      let user = {};
      if (email_id)
        user = await User.findOne({ where: { email_id: req.body.email_id } });
      else if (username)
        user = await User.findOne({ where: { username: req.body.username } });
      else if (mobile_number)
        user = await User.findOne({ where: { mobile_number: req.body.mobile_number } })
      else
        res.status(400).json(error("User does not match", 400))
      if (user) {
        // var email_otp = Math.floor(100000 + Math.random() * 900000)
        // var mobile_otp = Math.floor(100000 + Math.random() * 900000)
        var email_otp = 123456;
        var mobile_otp = 123456;
        var updatedata = {}
        if (user.user_type == 1) {
          updatedata = {
            login_otp: email_otp,
          }
        } else {
          updatedata = {
            phone_otp: mobile_otp
          }
        }
        User.update(updatedata, { where: { id: user.id }, })
          .then(updatedata => {
            if (user.user_type == 1) {
              res.json(success('Please enter the OTP!', { email_otp: email_otp }, res.statusCode))
            } else {
              res.json(success('Please enter the OTP!', { mobile_otp: mobile_otp }, res.statusCode))
            }
          })

      }else{
        res.json(error("User does not match", 400))
      }
    } catch (error) {
      res.status(400).json(error('Something went wrong', 400))
    }
  }


  static verifyOtp = async (req, res) => {
    logger.info(`${LOG_ID}/verifyOtp`)
    try {
      let { User }= await createDB1Manager();
      let query = {};
      let data= {}; 
        if (req.body.mobile) {
          query.mobile_number = req.body.mobile;
          query.phone_otp = req.body.otp;
          data = {
            phone_otp: null,
            phone_verify: 1,
            status: 1
          }
        }
        if (req.body.email) {
          query.email_id = req.body.email;
          query.login_otp = req.body.otp;
          data = {
            login_otp: null,
            email_verify: 1,
            status: 1
          }
        }
        const checkUser = await User.findOne({where:query});
        if (!checkUser) {
          return res.json(error("Invalid Otp!", 400));
        }
        await User.update(data, { where: { uuid: checkUser.uuid } })
        const  hasuser = await User.findOne({ where: { uuid: checkUser.uuid }});
        return res.json(success("OTP Matched !", hasuser, 200))
    } catch (errors) {
      res.json(error(errors.message, 400))
    }
  }
  static verifyEmailAndPhone = async (req, res) => {
    try {
      let { User }= await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }
      let data = {};
      
        if (req.body.mobile) {
          const checkMobileNumber = await User.findOne({where:{uuid:{ [Op.ne]: token.id },mobile_number:req.body.mobile}});
          if (checkMobileNumber) {
            res.json(error('Mobile number is already exists', 400))
            return;
          }
          
          data.mobile_number = req.body.mobile;
          data.phone_otp = 123456;
        }
        if (req.body.email) {
          const checkMobileNumber = await User.findOne({where:{uuid:{ [Op.ne]: token.id },email_id: req.body.email}});
          if (checkMobileNumber) {
            res.json(error('Email is already exists', 400))
            return;
          }
          data.email_id = req.body.email;
          data.login_otp = 123456;
        }
        await User.update(data,{where:{uuid: token.id}});
        const getUserDetailsq = await User.findOne({where:{uuid: token.id}});
        return res.json(success("Send OTP successfully !", getUserDetailsq, 200))
    } catch (errors) {
      console.log('errors',errors)
      res.json(error(errors.message, 400))
    }
  }
  static ResetPassword = async (req, res) => {
    logger.info(`${LOG_ID}/ResetPassword`)
    try {
      let { User }= await createDB1Manager();
      const username = req.body.username;
      const email_id = req.body.email_id;
      const mobile_number = req.body.mobile_number;
      const password = encryption.encrypt(req.body.new_password)
      // const otp = req.body.otp
      let user = {};
      if (email_id)
        user = await User.findOne({ where: { email_id: req.body.email_id } });
      else if (username)
        user = await User.findOne({ where: { username: req.body.username } });
      else if (mobile_number)
        user = await User.findOne({ where: { mobile_number: req.body.mobile_number } })
      else
        res.status(400).json(error('User does not match', 400))
      if (user) {
        var updatePassword = {
          password: password,
          login_otp: null,
          phone_otp: null
        }
        await User.update(updatePassword, { where: { id: user.id }, })
          .then(updatedata => {
            res.json(success('Password reset successfully', null, res.statusCode))
          })
      }
    } catch (err) {
      res.status(400).json(error(err.message, 400))
      return;
    }
  }

  static sendMsg = (req, res) => {
    logger.info(`${LOG_ID}/sendMsg`)
    let key = "4c33fbf5d7e4754245debcdfd50bbe4015b8f3fae41d13c3";
    let sid = "breedcoins1";
    let token = "b52afa1880814a0d368e6bdc8c3e63c332a9ff3391aab10b";
    let from = "+918072609370";
    let to = "+919315290347";
    let body = "Good Evening";

    const formUrlEncoded = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
    console.log(formUrlEncoded)

    let url = "https://" + key + ":" + token + "@api.exotel.in/v1/Accounts/" + sid + "/Sms/send.json"
    console.log(url)
    axios.post(url,
      formUrlEncoded({
        "From": from,
        "To": to,
        "Body": body
      }),
      {
        withCredentials: true,
        headers: {
          "Accept": "application/x-www-form-urlencoded",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      },
    )
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch((error) => {
        console.error(error)
      })

  }
  static socialAuthApi = async (req, res) => {
    try {
      let { User, Session }= await createDB1Manager();
      const userData = await User.findOne({where:{ email_id: req.body.email }});
      console.log('userData',userData);
      if (userData) {
        var token = await helper.validToken('generate', null, userData.uuid);
        const sess_token = req.session.id;
        const result = await Session.count({ where: { 'uid': userData.id } })
        let sessionData = {};
        sessionData = {
            session_id: sess_token,
            token: token,
            uuid: userData.id,
            uuid: token.uuid,
            status: "1"
          };
        if (result == 0) {
          await Session.create(sessionData);
        } else {
          await Session.update(sessionData, { where: { uuid:userData.id } });
        }
        await User.update({social_id: req.body.UID}, { where: { id:userData.id } });
        let resData = {
          'email_id': userData.email_id,
          'mobile_number': userData.mobile_number,
          'username': userData.username,
          'user_type': userData.user_type,
          'email_verify': userData.email_verify,
          'phone_verify': userData.phone_verify,
          'token': token
        }
        res.json(success("Login Successfully", resData, res.statusCode))
      } else {
        let registerData = {
          email_id: req.body.email,
          social_id:req.body.UID,
          email_verify: 1,
          user_type: 1,
          user_role:'USR'
        };
        let userData1= await User.create(registerData);
        var token = await helper.validToken('generate', null, userData1.uuid);
        let resData = {
          'email_id': userData1.email_id,
          'mobile_number': userData1.mobile_number,
          'username': userData1.username,
          'user_type': userData1.user_type,
          'email_verify': userData1.email_verify,
          'phone_verify': userData1.phone_verify,
          'token': token
        }
        res.json(success("Login Successfully", resData, res.statusCode))
      }
    } catch (errors) {
      res.json(error(errors.message, 400))
    }
  }

  static removeMobileOrEmail = async (req, res) => {
    logger.info(`${LOG_ID}/removeMobileYaEmail`)
    try {
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.json(error('Unauthorized User', 400))
        return;
      }

      let { User }= await createDB1Manager();
      let userData = await User.findOne({
        where: { uuid: token.id }
      });
      if(userData){
        let data= {};
        let msg= '';
        if(req.body.mobile_number){
          data.mobile_number=null;
          data.phone_verify= 0;
          msg= "Mobile Number Remove Successfully"
        }else{
          data.email_id= null;
          data.email_verify= 0;
          msg="Email Remove Successfully"
        }
        await User.update(data, { where: { id: userData.id }, })
        res.json(success(msg, null, res.statusCode))
      }else{
        res.status(400).json(error('No data available', 400))
      }
    } catch (err) {
      res.status(400).json(error(err.message, 400))
    }
  }
}

module.exports = { UserController }