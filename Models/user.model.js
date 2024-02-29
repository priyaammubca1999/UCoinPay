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
    accountDetails: { type: Object },
    kycImage: { type: Object, default: {} },
    kycStatus: { type: Number, default: 0 },
    secretStatus: { type: Number },
}

const backSchema = new mongoose.Schema(schemaObj);
backSchema.index({ u_id: 1 })
module.exports = mongoose.model('Backend', backSchema, "registerList")