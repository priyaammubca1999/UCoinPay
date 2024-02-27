const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const multichainWallet = require("multichain-crypto-wallet");
require('dotenv').config();

let key = CryptoJS.enc.Utf8.parse("U_PRO@2024");
let iv = CryptoJS.enc.Utf8.parse("U_PRO@2024");
let jwtTokenAdmin = process.env.NODE_JWT_SECRET_KEY;

exports.encrypt = (value) => {
     let cipher = CryptoJS.AES.encrypt(value, key, { iv: iv }).toString();
     return cipher;
};

let decrypt = exports.decrypt = (value) => {
     console.log('value: ', value);
     let decipher = CryptoJS.AES.decrypt(value, key, { iv: iv });
     let decrypt_val = decipher.toString(CryptoJS.enc.Utf8);
     return decrypt_val;
};

exports.createPayloadAdmin = (key) => {
     let payload = { subject: key };
     let token = jwt.sign(payload, jwtTokenAdmin, { "expiresIn": 60 });
     return token;
}

exports.tokenMiddlewareAdmin = (req, res, next) => {
     if (req.headers.authorization) {
          let token = req.headers.authorization;
          if (token != null) {
               jwt.verify(token, jwtTokenAdmin, (err, payload) => {
                    if (payload) {
                         let userid = payload;
                         req.userId = userid;
                         next();
                    } else {
                         res.json({ "status": false, "message": "Unauthorized Token" })
                    }
               })
          } else {
               res.json({ "status": false, "message": "Token is Required" })
          }
     } else {
          res.json({ "status": false, "message": "Unauthorized" })
     }
}


exports.createWallet = async () => {
     const wallet = multichainWallet.createWallet({
          network: "ethereum",
     });
     return wallet;
}

exports.generateId = (prefix, currentId) => {
     const formattedId = String(currentId).padStart(4, '0'); // Pad the ID with zeros to ensure it's always 4 digits
     currentId++;
     return `${prefix}_${formattedId}`;
}

exports.imageUpload = (file, callback) => {
     try {
          if (file != undefined && typeof file != 'undefined') {
               console.log(file, "file")
               let splits = file.originalname.split('.');
               const params = {
                    // Bucket: config.awsOptions.Bucket,
                    Key: Date.now().toString() + '.' + splits[(splits.length) - 1],
                    Body: file.buffer,
                    ACL: 'public-read'
               }
               s3.upload(params, (err, data) => {
                    if (err) {
                         console.log(err, "err")

                         callback({ "status": false });
                    } else {
                         callback({ "status": true, "url": data.Location });
                    }
               });
          } else {
               console.log(error1, "error1")

               callback({ "status": false });
          }
     } catch (err) {
          console.log("Error catched in file upload", err)
          callback({ "status": false });
     }
}