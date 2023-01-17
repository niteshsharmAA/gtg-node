const CryptoJS = require('crypto');
var aes256 = require('nodejs-aes256');


//encrypt
function encrypt(txt){
    ciphertext = aes256.encrypt(process.env.ENCRYPT_DECRYPT_SECRET_KEY,txt).toString();
    return ciphertext
 }
 
 // Decrypt
 function decrypt(encryptTxt){
    console.log('encryptTxt',encryptTxt);
    originalText  = aes256.decrypt(process.env.ENCRYPT_DECRYPT_SECRET_KEY,encryptTxt)
    //   originalText = bytes.toString(CryptoJS.enc.Utf8);
     return originalText
  }

module.exports={encrypt,decrypt}