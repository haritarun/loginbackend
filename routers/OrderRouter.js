const express = require('express');
const router = express.Router();
const {OrderController,GetOrderDetailes} = require('../controllers/OrderController')

router.post('/orderNow',OrderController)
router.get('/getOrderDetailes',GetOrderDetailes)

module.exports = router