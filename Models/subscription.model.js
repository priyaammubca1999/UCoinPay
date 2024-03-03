const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: { type: String, default: "" },
    date: { type: Date, default: Date.now() },
}, { versionKey: false })

subscriptionSchema.index({ email: 1 })
module.exports = mongoose.model('Subscription', subscriptionSchema, "subscriptionList");