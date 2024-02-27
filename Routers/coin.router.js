const express = require('express');
const coinRouter = express.Router();
const coinController = require('../Controllers/coin.Controller');

coinRouter.get('/getCoinData', coinController.getCoinData);

module.exports = coinRouter;
