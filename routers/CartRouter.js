const express = require('express')
const router= express.Router()
const {cart,CartGet,GetIncrement,GetDecrement,GetDetailes,GetDelete} = require('../controllers/CartControllers.js')

router.post('/addtocart',cart)
router.get('/getcartdetailes',CartGet)
router.put('/getIncrement',GetIncrement)
router.put('/getDecrement',GetDecrement)
router.get('/getDetailes',GetDetailes)
router.delete('/delete',GetDelete)

module.exports = router