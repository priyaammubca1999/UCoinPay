const express = require('express');
const backRouter = express.Router();
const backController = require('../Controllers/user.Controller');
const common = require('../helper/common');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

backRouter.post('/register', backController.registerFunction);
backRouter.post('/verifyRegistration', backController.registerVerify);
backRouter.post('/login', backController.loginFunction);

backRouter.post('/profileDetails', common.tokenMiddlewareAdmin, backController.userProfile);
backRouter.post('/getAllUsers', backController.getUserLoginDetails);
backRouter.post('/imageUpload', upload.single('image'), backController.imageUpload);

module.exports = backRouter;