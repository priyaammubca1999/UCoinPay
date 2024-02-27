const express = require('express');
const crypto = require('crypto');
const transporter = require('../helper/nodemailer')
const common = require('../helper/common');
const jwt = require("jsonwebtoken");
var userDB = require('../Models/user.model');
var userLoginDB = require("../Models/userLogin.model")
var queryHelper = require('../helper/query');
const mongoose = require('mongoose');
var Encrypter = require('../helper/crypter');

require('dotenv').config();

/** To add User Register Data on DB by using this API */
exports.registerFunction = async (req, res) => {
    try {
        let { username, email, password, confirmPassword, u_id, website_url } = req.body;

        const existingUser = await userDB.findOne({ email })
        if (existingUser) {
            return res.status(400).send({
                status: false,
                message: "It seems you already have an account, please log in instead.",
            });
        } else {
            function generateVerificationToken() {
                return crypto.randomBytes(20).toString('hex');
            }
            const verificationToken = generateVerificationToken();

            const mailOptions = {
                from: process.env.NODE_FROM_MAIL_ADDRESS,
                to: email,
                subject: 'Please verify your email address',
                text: `Hello ${username},\n\nPlease click on the following link to verify your email address:\n\nhttp://localhost:4200/vrf/${verificationToken}`
            };

            let regData = { username, email, password, website_url, confirmPassword, u_id, verificationString: verificationToken, verifiedStatus: false }

            userDB.insertMany(regData, async (err, data) => {
                if (err) {
                    return res.status(409).send({ status: false, message: "Error in Register" });
                }
                else {
                    await transporter.sendMail(mailOptions);
                    console.log('Verification email sent');
                    return res.status(200).send({ status: true, message: 'Verification email sent to: ' + data[0].email });
                }
            })
        }
    } catch (error) {
        console.log('error: ', error);
        return res.status(404).send({ status: false, message: 'Something Went Wrong' });
    }
}

// To Verify User Verification Status using this API
exports.registerVerify = async (req, res) => {
    try {
        let { verifyToken } = req.body;
        const verifyTokenFromDB = await userDB.findOne({ verificationString: verifyToken })
        const countInDB = await userDB.countDocuments()
        if (verifyTokenFromDB) {
            if (!verifyTokenFromDB.verifiedStatus) {
                const values = await common.createWallet()
                const userId = await common.generateId('UPRO', countInDB)
                let updateVerifiedStatus = await userDB.findOneAndUpdate({ verificationString: verifyTokenFromDB.verificationString }, { verifiedStatus: true, accountDetails: { address: Encrypter(values.address, 'ENCRYPT'), privateKey: Encrypter(values.privateKey, 'ENCRYPT'), phrase: Encrypter(values.mnemonic, 'ENCRYPT') }, u_id: userId })
                if (updateVerifiedStatus) {
                    return res.status(200).send({ status: true, message: 'Verified Status Successfully Updated' })
                } else {
                    return res.status(409).send({ status: false, message: "Verification Status Update Failed" })
                }
            } else {
                return res.status(201).send({ status: false, message: "Verification Already Updated" })
            }
        } else {
            return res.status(409).send({ status: false, message: "Error in Fetching Verification String" })
        }

    } catch (err) {
        console.log('err: ', err);
        return res.status(404).send({ status: false, message: 'Something Went Wrong' })
    }
}

// To Login the Registered user with this API.
exports.loginFunction = async (req, res) => {
    try {
        let { email, password } = req.body;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        ip = ip.split(',')[0];
        ip = ip.split(':').slice(-1);
        ip = ip[0].toString()

        const userExist = await userDB.findOne({ email }).select("+password")
        if (!userExist) {
            return res.status(401).json({ status: false, message: "Invalid email or password. Please try again with the correct credentials.", });
        } else {
            let tokenData = { email: userExist.email, password: userExist.password, verificationString: userExist.verificationString, verifiedStatus: userExist.verifiedStatus, u_id: userExist.u_id }
            let tokenExpiresDetails = { expiresIn: '1h' }
            let token = jwt.sign(tokenData, process.env.NODE_JWT_SECRET_KEY, tokenExpiresDetails)
            return res.status(200).send({ status: true, message: "Login Successfully", data: token })
        }

    } catch (error) {
        console.log('error: ', error);
        return res.status(404).send({ status: false, message: 'Something Went Wrong' });

    }
}


exports.userProfile = (req, res) => {
    try {
        queryHelper.findoneData("Backend", { "u_id": req.userId.u_id }, {}, async (result) => {
            if (result) {
                console.log('result: ', result);
                let [newAddress] = [Encrypter(result['accountDetails'].address, 'DECRYPT')]
                return res.status(200).send({ status: true, data: { result, decryptedDetails: { address: newAddress } } });
            } else {
                return res.status(404).send({ status: false, message: 'Something Went Wrong' });
            }
        })
    } catch (error) {
        console.log('error: ', error);
        return res.status(404).send({ status: false, message: 'Something Went Wrong' });
    }
}
