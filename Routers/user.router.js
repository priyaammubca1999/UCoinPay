const express = require('express');
const backRouter = express.Router();
const backController = require('../Controllers/user.Controller');
const common = require('../helper/common');

backRouter.post('/register', backController.registerFunction);
backRouter.post('/verifyRegistration', backController.registerVerify);
backRouter.post('/login', backController.loginFunction);

backRouter.post('/profileDetails', common.tokenMiddlewareAdmin, backController.userProfile);

module.exports = backRouter;