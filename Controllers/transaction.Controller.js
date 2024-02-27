const express = require('express');
const common = require('../helper/common');
const transactionDB = require('../Models/transaction.model');
var queryHelper = require('../helper/query');
const mongoose = require('mongoose');
const ENCRYPTER = require('../helper/crypter')


exports.createTransactionFunction = async (req, res) => {
    try {
        let { u_id, uu_id, upro_amount, phrase, currency, fiat, website_url } = req.body;
        const values = await common.createWallet()
        common.basicDetails((resul) => {
            queryHelper.insertData('Transaction_Table', {
                u_id,
                uu_id,
                upro_amount,
                phrase,
                currency,
                fiat,
                website_url,
                accountDetails: {
                    address: values.address,
                    privateKey: ENCRYPTER(values.privateKey, "ENCRYPT"),
                    phrase: ENCRYPTER(values.mnemonic, "ENCRYPT"),
                },
                ip: resul.ipAddress,
                os: resul.osType,
                lastTime: resul.dateTime
            }, (result) => {
                console.log('result: ', result);
                if (result) {
                    return res.json({ status: true, message: "Transaction Created Successfully", data: result })
                } else {
                    return res.json({ status: false, message: "Something went wrong" })
                }
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