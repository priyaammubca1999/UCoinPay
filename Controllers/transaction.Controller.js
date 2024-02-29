const express = require('express');
const common = require('../helper/common');
const transactionDB = require('../Models/transaction.model');
var queryHelper = require('../helper/query');
const mongoose = require('mongoose');
const ENCRYPTER = require('../helper/crypter')
const axios = require('axios');
const url = process.env.NODE_COIN_GECKO_API;
const qr = require('qrcode');

exports.createTransactionFunction = async (req, res) => {
    try {
        let { u_id, uu_id, phraseByUser, currency, fiat, website_url } = req.body;
        queryHelper.findoneData("Transaction_Table", { uu_id }, {}, async (resultresp) => {
            console.log('resultresp: ', resultresp);
            if (resultresp.uu_id === uu_id) {
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
            uproValue = fiat * uproCurrency;

            await common.basicDetails((resul) => {
                queryHelper.insertData('Transaction_Table', {
                    u_id,
                    uu_id,
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
                        uu_id: result[0].uu_id,
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