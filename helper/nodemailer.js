const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    // service: 'sendgrid',
    // secure: false,
    port: process.env.NODE_MAIL_PORT || 587,
    host: process.env.NODE_MAIL_HOST || 'smtp.sendgrid.net',
    auth: {
        user: process.env.NODE_MAIL_AUTH_USER || 'unified_acct_USbd1e4e88c5ab15c7ffde862ac2950374',
        pass: process.env.NODE_MAIL_AUTH_PASS || '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'
    }
});

module.exports = transporter;
