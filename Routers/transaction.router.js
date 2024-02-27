const express = require("express");
const router = express.Router();
const validation = require('../helper/validator');
const transactionController = require("../Controllers/transaction.Controller");
const common = require('../helper/common');

// Basic

router.post('/createTransaction', transactionController.createTransactionFunction)
router.get('/getDetailsFromTokenTransaction', common.tokenMiddlewareAdmin, transactionController.getTransactionDetailsFromToken)

module.exports = router;