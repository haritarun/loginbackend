const express = require('express');
const router = express.Router();
const { postLogin,verifyOtp } = require('../controllers/loginControllers');
const {signUp } = require('../controllers/signUpControllers')

router.post('/login', postLogin);
router.post("/verifyOtp",verifyOtp)
router.post('/verify',signUp)

module.exports = router;