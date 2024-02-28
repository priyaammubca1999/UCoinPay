const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const common = require('../helper/common');
const queryHelper = require('../helper/query');
const ENCRYPTER = require('../helper/crypter');
const axios = require('axios');

const os = require('os');
const userDB = require('../Models/user.model');

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let email = data.email.toLowerCase();
        let password = data.password;
        let pattern = data.pattern;
        if (data.otp == undefined && typeof data.otp == 'undefined') {
            data.otp = 0;
        }

        queryHelper.findoneData("Admin", { email, password, pattern }, {}, (result) => {
            if (result) {
                if (result.status == 1) {
                    common.basicDetails((resul) => {
                        queryHelper.updateData('Admin', '', { _id: result._id }, { os: resul.osType, ip: resul.ipAddress, lastLoginTime: resul.dateTime }, (result2) => {
                            if (data.otp != 0) {
                                let decKey = result.tfaSecret;
                                let verified = speakeasy.totp.verify({
                                    secret: decKey,
                                    encoding: 'base32',
                                    token: data.otp
                                });
                                console.log('verified: ', verified);
                                if (verified) {
                                    let payLoad = common.createPayloadAdmin(result._id.toString());
                                    res.json({ status: true, message: "Logged in successfully", origin: payLoad });
                                } else {
                                    res.json({ status: false, message: "Invalid OTP" })
                                }
                            } else {
                                if (result.tfaStatus == 0) {
                                    let payload = common.createPayloadAdmin(result._id.toString());
                                    res.json({ status: true, message: "Loggedin successfully", tfa: false, origin: payload })
                                } else {
                                    res.json({ status: true, message: "Please enter your tfa to continue", tfa: true })
                                }
                            }
                        })
                    })


                } else {
                    res.json({ status: false, message: "Your account has been de-activated by admin" })
                }
            } else {
                res.json({ status: false, message: "Invalid login credentials" })
            }
        })
    } catch (e) {
        console.log("Error catched in login", e);
        res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
    }
}

exports.getLoginUserDetails = async (req, res) => {
    try {

    } catch (err) {
        return res.json({ status: 404, message: "Something went wrong" })
    }
}


exports.getAdminLoginData = async (req, res) => {
    try {
        queryHelper.findData("Admin", {}, {}, {}, {}, (result) => {
            res.json({ status: 200, data: result, count: result.length })
        })
    } catch (err) {
        return res.json({ status: 404, message: "Something went wrong" })
    }
}


exports.getAllKycDetails = async (req, res) => {
    try {
        const result = await userDB.aggregate([
            { $match: {} },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, kycImage: 1 } }
        ]).exec();
        const filteredResult = result.filter(item => Object.keys(item).length !== 0);
        return res.json({ status: true, data: filteredResult });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
}



exports.register = async (req, res) => {
    try {
        let data = req.body;
        let email = data.email.toLowerCase();
        let password = data.password;
        let pattern = data.pattern;
        if (data.otp == undefined && typeof data.otp == 'undefined') {
            data.otp = 0;
        }
        var tfaSecret = speakeasy.generateSecret({ length: 20 });
        queryHelper.insertData('Admin', { email, password, pattern, tfaSecret: tfaSecret.base32 }, (result) => {
            if (result) {
                return res.json({ status: true, message: "registered Successfully" })
            } else {
                return res.json({ status: false, message: "Oops! Something went wrong. Please try again later" })
            }
        })
    } catch (e) {
        console.log("Error catched in login", e);
        res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
    }
}