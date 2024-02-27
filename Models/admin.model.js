const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    pattern: { type: String, default: "" },
    status: { type: Number, default: 1 },
    tfaStatus: { type: Number, default: 0 },
    tfaSecret: { type: String, default: "" },
    date: { type: Date, default: Date.now() }
}, { versionKey: false })

adminSchema.index({ username: 1 })
module.exports = mongoose.model('Admin', adminSchema, "adminList")
