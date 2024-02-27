const mongoose = require('mongoose');

const schemaObj = {
    email: { type: String },
    password: { type: String },
    token: { type: String },
    // ip: { type: String },
    // locationDetails: { type: String },
}

const backLoginSchema = new mongoose.Schema(schemaObj);
backLoginSchema.index({ u_id: 1 })
module.exports = mongoose.model('Backend_Login', backLoginSchema, "loginList")