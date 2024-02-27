var CRON = require('node-cron');
var queryHelper = require('../helper/query');
var common = require('../helper/common');
var ENCRYPTER = require('../helper/crypter');
require('dotenv').config();


module.exports = () => {
     CRON.schedule('*/1 * * * *', async () => {

          function original(e) {
               e = e - 0.1
               e = e.toFixed(9);
               return e;
          }
          function calculateMaxFunds(ethBalance, gasLimit = 21000, gasPrice = 100) {
               // Convert gas price to Wei (1 Ether = 10^18 Wei)
               const gasPriceWei = gasPrice * 1e9;

               // Calculate the maximum transaction fee
               const maxTransactionFee = gasLimit * gasPriceWei;

               // Calculate the maximum funds to transfer
               console.log("Max funds to transfer:", ethBalance * 1e18 - maxTransactionFee);
               const maxFundsToTransfer = ethBalance * 1e18 - maxTransactionFee;
               return maxFundsToTransfer;
          }

          // running a task every 5 seconds
          queryHelper.findData("Transaction_Table", {}, {}, {}, {}, (result) => {
               // console.log(result)
               result.forEach(async (data) => {
                    console.log('data: ', data);
                    common.getBalance(data.accountDetails.address, (balance) => {
                         console.log('balance: ', balance);
                         if (balance.balance > 0.0000000) {
                              const maxFunds = calculateMaxFunds(balance.balance)
                              console.log("IN IF");
                              console.log('process.env.NODE_ADMIN_ADDRESS, maxFunds, ENCRYPTER(data.accountDetails.privateKey, "DECRYPT": ', process.env.NODE_ADMIN_ADDRESS, maxFunds, ENCRYPTER(data.accountDetails.privateKey, "DECRYPT"))
                              common.transfer(process.env.NODE_ADMIN_ADDRESS, maxFunds, ENCRYPTER(data.accountDetails.privateKey, "DECRYPT"), ((resultOne) => {
                                   console.log('resultOne: ', resultOne);
                                   if (resultOne) {
                                        queryHelper.updateData('Transaction_Table', 'one', { _id: data._id, transactionHash: resultOne.hash }, { status: 1 }, (result) => {
                                             console.log('result: ', result);
                                        })
                                   }
                              }))
                         } else {
                              console.log("IN ELSE");
                              return ({
                                   status: false
                              })
                         }

                    })

               })
          })
     })
}






