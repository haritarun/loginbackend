const {chat,getChat,getUserName} = require('../controllers/ChatController');
const express = require('express');
const router = express.Router();

router.post('/chat', chat);
router.post('/getChatList',getChat);
router.post('/getUserName',getUserName);

module.exports = router;