const express = require('express');
const common = require('../helper/common');
const transactionDB = require('../Models/transaction.model');
var queryHelper = require('../helper/query');
const mongoose = require('mongoose');
const ENCRYPTER = require('../helper/crypter')
const axios = require('axios');
const url = process.env.NODE_COIN_GECKO_API;
const qr = require('qrcode');
const multichainWallet = require("multichain-crypto-wallet");

exports.createTransactionFunction = async (req, res) => {
    try {
        let { u_id, yc_u_id, phraseByUser, currency, fiat, website_url } = req.body;
        queryHelper.findoneData("Transaction_Table", { yc_u_id }, {}, async (resultresp) => {
            console.log('resultresp: ', resultresp);
            if (resultresp.yc_u_id === yc_u_id) {
                if (resultresp.transactionHash === 'Pending') {
                    return res.status(200).send({ status: true, message: 'Transaction Already in Pending' })
                }
            }


            const values = await common.createWallet()
            let qrUrl;

            qr.toDataURL(values.address, (err, url) => {
                if (err) console.error(err)
                console.log(url)
                qrUrl = url;
            })

            let uproValue;
            let currencyEndPoint = currency.toLowerCase() === 'usd' ? 'usd' : 'inr';
            const resp = await axios.get(`${url}${currencyEndPoint}`);
            const uproCurrency = resp.data.ultrapro[currencyEndPoint];
            uproValue = Number(fiat) / Number(uproCurrency);
            console.log('uproValue: ', uproValue, typeof uproValue);

            await common.basicDetails((resul) => {
                queryHelper.insertData('Transaction_Table', {
                    u_id,
                    yc_u_id,
                    phraseByUser,
                    currency,
                    fiat,
                    uproValue,
                    website_url,
                    accountDetails: {
                        address: values.address,
                        privateKey: ENCRYPTER(values.privateKey, "ENCRYPT"),
                        phrase: ENCRYPTER(values.mnemonic, "ENCRYPT"),
                    },
                    ip: resul.ipAddress,
                    os: resul.osType,
                    lastTime: resul.dateTime
                }, (result, err) => {
                    let respObj = {
                        u_id: result[0].u_id,
                        yc_u_id: result[0].yc_u_id,
                        upro_amount: result[0].uproValue,
                        phrase: result[0].phraseByUser,
                        date: result[0].date,
                        ip: result[0].ip,
                        os: result[0].os,
                        address: result[0]?.accountDetails?.address,
                        transactionHash: result[0]?.transactionHash,
                        qr: qrUrl,
                    }
                    if (result) {
                        return res.json({ status: true, message: "Transaction Created Successfully", data: respObj })
                    } else {
                        return res.json({ status: false, message: "Something went wrong" })
                    }
                })
            })
        })

    } catch (err) {
        return res.json({ status: 404, message: "Something went wrong" })
    }
}

exports.getTransactionDetailsFromToken = (req, res) => {
    console.log('req.userId.u_id: ', req.userId.u_id);
    try {
        queryHelper.findData('Transaction_Table', { "u_id": req.userId.u_id }, {}, { _id: -1 }, {}, (result) => {
            if (result) {
                return res.json({ status: true, data: result, count: result.length })
            } else {
                return res.json({ status: false, message: "Something went wrong" })
            }
        })
    } catch (err) {
        return res.json({ status: 404, message: "Something went wrong" })
    }
}

exports.balanceCheckFunction = async(req, res) => {
    try{
        let {secret, reqaddress} = req.body;
        console.log('secret, reqaddress: ', secret, reqaddress);
        let decryptedSecret = ENCRYPTER(secret, "DECRYPT");
        console.log('decryptedSecret: ', decryptedSecret);
        
        queryHelper.findoneData("Backend", { u_id: req.userId.u_id }, {}, async (result) => {
            if(result){
                if(result.randomString === secret){
                    async function getBal(_address) {
                        console.log('_address: ', _address);
                        const balance = await multichainWallet.getBalance({
                             address: _address,
                             network: "ethereum",
                             rpcUrl: "https://testnet-rpc.ultraproscan.io/",
                        });
                        return balance.balance;
                   }
                    const balance = await getBal(reqaddress);
                    console.log('balance: ', balance);
                    return res.status(200).send({ status: true, message: "Balance", data: balance });
                } else {
                    return  res.status(201).send({ status: false, message: "Can't Get Balance From the Address" });
                }
            } else {
                return res.send(201).send({ status: false, message: 'Not Found' });
            }
        })
    } catch(error){
        console.log('error: ', error);
        return res.json({ status: 404, message: "Something went wrong" })
    }
}