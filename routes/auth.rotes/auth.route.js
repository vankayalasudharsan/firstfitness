const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/auth/auth.controller');
const mailController = require('../../helper/mailhelper')

router.post('/sing-up',AuthController.VerifySingUpOtp,AuthController.singUp);
router.post('/send-singUp-Otp',AuthController.SendSingupOtp,mailController.SendSingUpOtp)
router.post('/login',AuthController.Login);
router.post('/forget-password',AuthController.forgetPassword,mailController.forgetPassword);
router.post('/reset-password',AuthController.resetPassword)

module.exports = router