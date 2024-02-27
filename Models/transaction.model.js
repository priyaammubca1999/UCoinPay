const mongoose = require('mongoose');

const transactionTableSchema = new mongoose.Schema({
    u_id: { type: String, default: "" },
    uu_id: { type: String, default: "" },
    upro_amount: { type: String, default: "" },
    phrase: { type: String, default: '' },
    currency: { type: String, default: '' },
    fiat: { type: String, default: '' },
    date: { type: Date, default: Date.now() },
    ip: { type: String, default: "" },
    os: { type: String, default: "" },
    lastTime: { type: Date, default: '' },
    accountDetails: { type: Object, default: {} },
    website_url: { type: String, default: '' },
    transactionHash: { type: String, default: 'Pending' }
}, { versionKey: false })

transactionTableSchema.index({ username: 1 })
module.exports = mongoose.model('Transaction_Table', transactionTableSchema, "transactionList")
