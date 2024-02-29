const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const multichainWallet = require("multichain-crypto-wallet");
require('dotenv').config();
const aws = require('aws-sdk');
const config = require("../node_details/local")
let key = CryptoJS.enc.Utf8.parse("U_PRO@2024");
let iv = CryptoJS.enc.Utf8.parse("U_PRO@2024");
let jwtTokenAdmin = process.env.NODE_JWT_SECRET_KEY;
const s3 = new aws.S3(config.awsOptions);
var os = require("os")
var axios = require('axios')
var ethers = require('ethers');

exports.encrypt = (value) => {
     let cipher = CryptoJS.AES.encrypt(value, key, { iv: iv }).toString();
     return cipher;
};

exports.decrypt = (value) => {
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
          res.json({ "status": false, "message": "Unauthorized", code: 700 })
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
                    Bucket: config.awsOptions.Bucket,
                    Key: Date.now().toString() + '.' + splits[(splits.length) - 1],
                    Body: file.buffer,
                    ACL: 'public-read'
               }
               s3.upload(params, (err, data) => {
                    if (err) {
                         console.log(err, "err from common page")

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

exports.basicDetails = (callback) => {
     function getIPAddress() {
          return axios.get('https://api.ipify.org/?format=json')
               .then(response => response.data.ip)
               .catch(error => console.error('Error fetching IP address:', error));
     }
     const osType = os.type();

     function getCurrentDateTime() {
          const now = new Date();
          return now.toISOString();
     }

     Promise.all([getIPAddress(), getCurrentDateTime(), osType])
          .then(([ipAddress, dateTime]) => {
               sendDataToServer(ipAddress, dateTime, osType);
          })
          .catch(error => console.error('Error:', error));

     function sendDataToServer(ipAddress, dateTime, osType) {
          console.log('Sending data to server:', ipAddress, dateTime, osType);
          callback({ ipAddress, dateTime, osType })
     }
}

exports.getBalance = async (address, callback) => {
     const balance = await multichainWallet.getBalance({
          address,
          network: "ethereum",
          rpcUrl: "https://testnet-rpc.ultraproscan.io/",
     });
     // console.log("Balance =>", balance);
     callback(balance)
}

exports.transfer = async (_toAddress, _value, _pvtKey, callback) => {
     console.log('_toAddress, _value, _pvtKey, callback: ', _toAddress, typeof _value, _pvtKey, callback);
     const transfer = await multichainWallet.transfer({
          recipientAddress: _toAddress,
          amount: ethers.parseEther(_value).toString(),
          network: "ethereum",
          rpcUrl: "https://testnet-rpc.ultraproscan.io/",
          privateKey:
               _pvtKey,
          gasPrice: "10", // This in Gwei leave empty to use default gas price 
     });
     const explorer = `https://testnet-explorer.ultraproscan.io/api?module=transaction&action=gettxinfo&txhash=${transfer.hash}`
     callback({ hash: transfer.hash, explorer })
}

// exports.calculateMaxFunds = async (ethBalance, gasLimit = 21000, gasPrice = 100, callback) => {
//      console.log('ethBalance: ', ethBalance);
//      const gasPriceWei = gasPrice * 1e9;
//      const maxTransactionFee = gasLimit * gasPriceWei;
//      const maxFundsToTransfer = ethBalance * 1e18 - maxTransactionFee;
//      callback( maxFundsToTransfer)
// }