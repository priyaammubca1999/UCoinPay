const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const common = require('../helper/common');
const queryHelper = require('../helper/query');
const ENCRYPTER = require('../helper/crypter');


exports.login = async (req, res) => {
    try {
        let data = req.body;
        let email = ENCRYPTER(data.email.toLowerCase(), "ENCRYPT");
        let password = ENCRYPTER(data.password, "ENCRYPT");
        let pattern = ENCRYPTER(data.pattern, "ENCRYPT");
        if (data.otp == undefined && typeof data.otp == 'undefined') {
            data.otp = 0;
        }

        queryHelper.findoneData("Admin", { email, password, pattern }, {}, (result) => {
            if (result) {
                if (result.status == 0) {
                    if (data.otp != 0) {
                        let decKey = ENCRYPTER(result.tfaSecret, "DECRYPT");
                        let verified = speakeasy.totp.verify({
                            secret: decKey,
                            encoding: 'base32',
                            token: data.otp
                        });
                        console.log('verified: ', verified);
                        if (verified) {
                            let payLoad = common.createPayloadAdmin(ENCRYPTER(result._id.toString(), "ENCRYPT"));
                            res.json({ status: true, message: "Logged in successfully", origin: payLoad });
                        } else {
                            res.json({ status: false, message: "Invalid OTP" })
                        }
                    } else {
                        if (result.tfaStatus == 0) {
                            let payload = common.createPayloadAdmin(ENCRYPTER(result._id.toString(), "ENCRYPT"));
                            res.json({ status: true, message: "Loggedin successfully", tfa: false, origin: payload })
                        } else {
                            res.json({ status: true, message: "Please enter your tfa to continue", tfa: true })
                        }
                    }
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


exports.register = async (req, res) => {
    try {
        let data = req.body;
        let email = ENCRYPTER(data.email.toLowerCase(), "ENCRYPT");
        let password = ENCRYPTER(data.password, "ENCRYPT");
        let pattern = ENCRYPTER(data.pattern, "ENCRYPT");
        if (data.otp == undefined && typeof data.otp == 'undefined') {
            data.otp = 0;
        }
        var tfaSecret = speakeasy.generateSecret({ length: 20 });
        console.log('tfaSecret: ', tfaSecret);
        queryHelper.insertData('Admin', { email, password, pattern, tfaSecret: tfaSecret.base32, status: 0, tfaStatus: 0 }, (result) => {
            console.log('result: ', result);
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