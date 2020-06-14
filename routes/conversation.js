const express = require('express')
const conversationController = require('../controllers/conversation')

const router = express.Router()

router.get('/', conversationController.getConversations)

router.post('/', conversationController.postConversation)

module.exports = router