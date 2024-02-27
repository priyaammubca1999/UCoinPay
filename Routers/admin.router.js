const express = require("express");
const router = express.Router();
const validation = require('../helper/validator');
const adminController = require("../Controllers/admin.Controller");

// Basic

router.post('/login', validation.postValidation, adminController.login)
router.post('/register', adminController.register)
router.post('/getLoginAdminDetails', adminController.getAdminLoginData)

module.exports = router;