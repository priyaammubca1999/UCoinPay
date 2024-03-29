const express = require("express");
const router = express.Router();
const validation = require('../helper/validator');
const adminController = require("../Controllers/admin.Controller");

// Basic

router.post('/login', validation.postValidation, adminController.login)
router.post('/register', adminController.register)
router.get('/getLoginAdminDetails', adminController.getAdminLoginData)
router.get('/getAllUserDetails', adminController.getAllUserLoginData)
router.get('/getAllKycDetails', adminController.getAllKycDetails)
router.post('/kycChangeStatus', adminController.kycAction)
module.exports = router;