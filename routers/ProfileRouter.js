const express = require('express');
const router = express.Router();
const { UserProfile,getUserProfile } = require('../controllers/UserProfile')

router.post('/updateProfile', UserProfile)
router.get('/getEmail', getUserProfile)

module.exports = router;    