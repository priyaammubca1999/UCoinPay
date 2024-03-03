const mongoose = require('mongoose');

const schemaObj = {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    verificationString: { type: String },
    verifiedStatus: { type: Boolean },
    u_id: { type: String },
    website_url: { type: String },
    kycImage: { type: Object, default: {} },
    kycStatus: { type: Number, default: 0 },
    secretStatus: { type: Number, default: 1 },
    profileImage: { type: String, default: '' },
    address: { type: String, default: '' },
    loginAttempts: { type: Number, default: 0 },
    loginBlockTime: { type: Date, default: '' },
    randomString: { type: String, default: '' },
}

const backSchema = new mongoose.Schema(schemaObj);
backSchema.index({ u_id: 1 })
module.exports = mongoose.model('Backend', backSchema, "registerList")