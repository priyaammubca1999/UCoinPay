var CRON = require('node-cron');
var queryHelper = require('../helper/query');
var common = require('../helper/common');
var ENCRYPTER = require('../helper/crypter');
require('dotenv').config();
const multichainWallet = require("multichain-crypto-wallet");
const userDB = require('../Models/user.model');


module.exports = () => {
     CRON.schedule('*/5 * * * *', async () => {
          async function transferBal(_toAddress, _value, _pvtKey) {
               const transfer = await multichainWallet.transfer({
                    recipientAddress: _toAddress, //
                    amount: _value,
                    network: "ethereum",
                    rpcUrl: "https://testnet-rpc.ultraproscan.io/",
                    privateKey:
                         _pvtKey,
                    gasPrice: "10", // This in Gwei leave empty to use default gas price 
               });
               return transfer.hash;

          }

          async function getBal(_address) {
               const balance = await multichainWallet.getBalance({
                    address: _address,
                    network: "ethereum",
                    rpcUrl: "https://testnet-rpc.ultraproscan.io/",
               });
               return balance.balance;
          }

          async function main(_addr) {
               try {
                    const address = _addr;
                    const balance = await getBal(address);
                    return balance; // Return the balance
               } catch (error) {
                    console.error('Error:', error);
                    return null; // Return null or handle the error appropriately
               }
          }

          const gasLimit = 21000;
          const gasPrice = 10000000000; // 10 Gwei in Wei
          const gasFee = (gasLimit * gasPrice) / 1e18; // Gas fee in ether
          const _toAddress = process.env.NODE_ADMIN_ADDRESS;

          queryHelper.findData("Transaction_Table", {}, {}, {}, {}, async (result) => {
               const pendingTransactions = result.filter(data => data.transactionHash === 'pending');
               await Promise.all(pendingTransactions.map(async (data) => {
                    console.log('data: ', data);
                    const _pvtKey = ENCRYPTER(data.accountDetails.privateKey, "DECRYPT");
                    const _fromAddr = data.accountDetails.address;
                    try {
                         const balance = await main(_fromAddr);
                         if (balance > 0.0000000) {
                              const upBal = balance - gasFee;
                              const strVal = upBal.toString();
                              let hash = await transferBal(_toAddress, strVal, _pvtKey);
                              console.log('hash: ', hash);
                              queryHelper.updateData('Transaction_Table', '', { u_id: data.u_id }, { transactionHash: hash, balance: strVal, gasFee }, (result) => {
                                   console.log('result: ', result);
                              });
                         } else {
                              console.log("No Balance");
                         }
                    } catch (error) {
                         console.error('Error in main:', error);
                    }
               }))
          })
     })

     CRON.schedule('0 * * * *', async () => {
          userDB.aggregate([
               { $match: {} },
               { $sort: { _id: 1 } },
          ], (err, users) => {
               if (err) {
                    console.log(err);
               }
               users.map(async (data) => {
                    if (data.loginAttempts !== 0) {
                         const updateDetails = await userDB.updateOne({ u_id: data.u_id }, { loginAttempts: 0 })
                         console.log('updateDetails: ', updateDetails);
                    }
               })
          })


     })
}






