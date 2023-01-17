const { createDB1Manager } = require('../models');
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const sgmail = require('@sendgrid/mail')
const API_KEY = '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'
sgmail.setApiKey(API_KEY)
class SecurityController {

  static google_2fa_requesting = async (req, res) => {
    let { User } = await createDB1Manager();
    const token = await helper.validToken('check', req.headers.authorization, null)
    if (token != null && token != undefined) {
      try {
        let userData= await User.findOne({ where: { uuid: token.id } });
        if(userData){
          // var otp = Math.floor(100000 + Math.random() * 900000);
          let otp = 123456;
          let username ='';
          if (userData.user_type == 1) {
            username = userData.email_id
            let sendMailData = {
              to: userData.email_id,
              subject: 'One Time Login Password',
              login_otp: otp
            }
            //helper.sendmail(sendMailData)
          }
          if (userData.user_type == 2) {
            username = userData.mobile_number
          }
          console.log('username',username);
          let secrect = speakeasy.generateSecret({
            name: username
          })
          let data = { google_otp_secrect_key: secrect.ascii, two_fa_email_otp: otp };
          let updateSecreckey = await User.update(data, { where: { uuid: token.id }, });
          if(updateSecreckey){
            let qrImage= await qrcode.toDataURL(secrect.otpauth_url);
            let apiData = {
              email_otp: otp,
              secrect_key: secrect.ascii,
              qrcode_image: qrImage,
            }
            res.json(success('Google Authentication Request', apiData, 200))
          }else{
            res.status(400).json(error('Some Error Occured !', 400))
          }
        }else{
          res.status(400).json(error('User Not Found', 400))
        }
      } catch (err) {
        res.status(400).json(error(err.message, 400))
      }
    } else {
      res.status(400).json(error("Unauthorized User", 400))
      return;
    }
  }

  static enable_google_2facode = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      if (req.body.secretkey == "" || req.body.otp == "" || req.body.email_otp == "") {
        res.status(400).json(error("Secrect Key,OTP and Email-OTP Field Cannot Be Empty!", 400));
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      })
        .then(userData => {
          if (userData) {
            if (userData.google_auth_2fa == 1) {
              res.status(400).json(error('This User Already Enable Google 2Fa Authentication', 400))
            }

            if (userData.google_otp_secrect_key == req.body.secretkey) {
              let speakEasy= {
                secret: userData.google_otp_secrect_key,
                encoding: 'ascii',
                token: req.body.otp
              }
              var verify_status = speakeasy.totp.verify(speakEasy)

              if (userData.two_fa_email_otp != req.body.email_otp) {
                res.status(400).json(error('Invalid E-Mail OTP Try Again !', 400))
              }
              console.log('verify_status',verify_status);
              if (verify_status == true) {
                var updateData = {
                  google_auth_2fa: 1,
                  two_fa_email_otp: null
                }
                User.update(updateData, { where: { uuid: token.id }, })
                  .then(enableGoogle2Fa => {
                    res.json(success('Google 2Fa Authentication Enable Successfully', null, 200))
                  })
                  .catch(enableGoogle2FaError => {
                    res.status(400).json(error(enableGoogle2FaError.message, 400))
                  })

              }
              else {
                res.status(400).json(error("Invalid Google OTP Try Again !", 400))
                return
              }
            }
            else {
              res.status(400).json(error('Secrect Key Not Matched !', 400))
            }
          }
          else {
            res.status(400).json(error('User Not Found Give Details', 400))
          }
        })
    }
    catch (err) {
      res.status(400).json(error(err.message, 400))
    }

  }

  static disable_google_2fa_request = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }

      User.findOne({
        where: { uuid: token.id }
      })
        .then(userData => {
          if (userData) {
            // var otp = Math.floor(100000 + Math.random() * 900000)
            var otp = 123456;
            if (userData.user_type == 1) {
              var sendMailData = {
                to: userData.email_id,
                subject: 'One Time Login Password',
                login_otp: otp

              }
              // helper.sendmail(sendMailData)
            }
            var updateData = {
              two_fa_email_otp: otp
            }
            User.update(updateData, { where: { uuid: token.id }, })
              .then(disableGoogle2Fa => {
                if (disableGoogle2Fa == 1) {
                  var responseData = {
                    email_otp: otp,
                    google_otp_secrect_key: userData.google_otp_secrect_key
                  }
                  res.json(success('Request Disable  Google 2Fa Authentication', responseData, 200))
                }
              })
              .catch(disableGoogle2FaError => {
                res.status(400).json(error(disableGoogle2FaError.message, res.statusCode))
              })

          }
          else {
            res.status(400).json(error('User Not Found Given Details', 400))
          }

        })
    } catch (err) {
      res.status(400).json(error(err.message, res.statusCode))
    }

  }

  static disable_google_2fa_auth = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return
      }
      if (req.body.secretkey == "" || req.body.otp == "" || req.body.email_otp == "") {
        res.status(400).json(error("Secrect Key,OTP and Email-OTP Field Cannot Be Empty!", 400));
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      })
        .then(userData => {
          if (userData) {
            if (userData.google_auth_2fa == 0) {
              res.status(400).json(error('This User Already Disable Google 2Fa Authentication', 400))
            }
            console.log('userData',userData);
            if (userData.google_otp_secrect_key == req.body.secretkey) {
              var verify_status = speakeasy.totp.verify({
                secret: userData.google_otp_secrect_key,
                encoding: 'ascii',
                token: req.body.otp
              })

              if (userData.two_fa_email_otp != req.body.email_otp) {
                res.status(400).json(error('Invalid E-Mail OTP Try Again !', 400))
              }

              if (verify_status == true) {
                var updateData = {
                  two_fa_email_otp: null,
                  google_otp_secrect_key: null,
                  google_auth_2fa: 0
                }
                User.update(updateData, { where: { uuid: token.id }, })
                  .then(disblestatus => {
                    if (disblestatus == 1) {
                      res.json(success('Your Google 2Fa Authentication Disable Successfully', null, 200))
                    }
                  })
              }
              else {
                res.status(400).json(error("Invalid Google OTP Try Again !", 400))
              }
            }
            else {
              res.status(400).json(error('Secrect Key Not Matched', 400))
            }
          }
          else {
            res.status(400).json(error('User Not Found Given Details', 400))
          }

        }).catch(err =>{ 
          res.status(400).json(error(err.message, res.statusCode))
        });
    }
    catch (err) {
      res.status(400).json(error(err.message, res.statusCode))
    }
  }
  static enable_mobile_2fa = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      }).then(data => {
        if (data) {
          // var otp = Math.floor(100000 + Math.random() * 900000)
          // var emailotp = Math.floor(100000 + Math.random() * 900000)
          var otp = 123456;
          var emailotp = 123456;
          if (data.user_type == 1) {
            var updatedata = {
              mobile_2fa_otp: otp,
              two_fa_email_otp: emailotp,
            }

            var sendMailData = {
              to: data.email_id,
              subject: 'One Time Login Password',
              login_otp: emailotp

            }
            // helper.sendmail(sendMailData)
          } else {
            var updatedata = {
              mobile_2fa_otp: otp
            }
          }
          User.update(updatedata, { where: { uuid: token.id }, })
            .then(updatedata => {
              if (updatedata == 1) {
                if (data.user_type == 1) {
                  var responseData = {
                    mobile_otp: otp,
                    twofa_email_otp: emailotp
                  }
                } else {
                  var responseData = {
                    mobile_otp: otp
                  }
                }
                res.json(success('OTP Send Your Register Mobile Number', responseData, 200))

              } else {
                res.status(400).json(error('Some Error Occured Please Try Again Later !', 400))
              }
            })
        } else {
          res.status(400).json(error('User not found', 400))
        }
      })

    } catch (err) {
      res.status(400).json(error(err.message, 400))
    }

  }

  static validate_mobile_2fa = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }

      if (req.body.mobile_otp == "") {
        res.status(400).json(error("Mobile OTP Field Cannot Be Empty!", 400));
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      }).then(result => {
        if (result.user_type == 1) {
          if (result.two_fa_email_otp != req.body.twofa_email_otp) {
            res.status(400).json(error('Invalid E-Mail OTP Try Again !', 400))
            return;
          }
        }
        if (result.mobile_2fa_otp == req.body.mobile_otp) {
          const updatedata = {
            mobile_auth_2fa: 1,
            mobile_2fa_otp: null,
            two_fa_email_otp: null
          }
          User.update(updatedata, { where: { uuid: token.id }, })
            .then(updatedata => {
              if (updatedata == 1) {
                res.json(success('Mobile OTP Authentication Enabled Successfully!', null, 200))
              }
              else {
                res.status(400).json(error('Some Error Occured Try Again !', 400))
              }
            })
        }
        else {
          res.status(400).json(error('Invalid OTP Try Again !', 400))
        }


      }).catch(err => {
        res.status(400).json(error(err.message, res.statusCode))

      })



    } catch (err) {
      res.status(400).json(error(err.message, res.statusCode))
    }

  }

  static request_mobile_disable2fa = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      }).then(data => {
        if (data) {
          var emailotp = Math.floor(100000 + Math.random() * 900000)
          var updatedata = {
            two_fa_email_otp: emailotp,
            mobile_2fa_otp: null,
          }
          User.update(updatedata, { where: { uuid: token.id }, })
            .then(updatedata => {
              if (updatedata == 1) {
                res.json(success('OTP Send Your Register Mobile Number', emailotp, 200))
              }
              else {
                res.status(400).json(error('Some Error Occured Try Again !', 400))
              }
            })
        } else {
          res.status(400).json(error("User Details Not Found", 400))
        }
      })

    } catch (err) {
      res.status(400).json(error(err.message, res.statusCode))
    }

  }

  static disable_mobile_2fa = async (req, res) => {
    try {
      let { User } = await createDB1Manager();
      const token = await helper.validToken('check', req.headers.authorization, null)
      if (!token) {
        res.status(400).json(error('Unauthorized User', 400))
        return;
      }
      if (req.body.twofa_email_otp == "") {
        res.status(400).json(error("Mobile OTP Field Cannot Be Empty!", 400));
        return;
      }
      User.findOne({
        where: { uuid: token.id }
      }).then(data => {
        if (data) {
          if (data.two_fa_email_otp == req.body.otp) {
            var data = {
              mobile_auth_2fa: 0,
              mobile_2fa_otp: null
            }
            User.update(data, { where: { uuid: token.id }, })
              .then(result => {
                res.json(success("Mobile OTP Authentication Disable Successfully", null, 200));

              })
          } else {
            res.status(400).json(error('Mail OTP Invalid Try Again !', 400))
          }
        } else {
          res.status(400).json(error('User Deatail Not Found', 400))
        }
      })

    } catch (error) {
      res.status(400).json(error(err.message, res.statusCode))
    }

  }



}

module.exports = { SecurityController }