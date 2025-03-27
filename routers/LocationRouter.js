const express = require('express');
const router = express.Router();
const {location,getLocation} = require('../controllers/LocationControllers.js')

router.post('/uploadLocation',location)
router.get('/getLocation',getLocation)

module.exports = router
