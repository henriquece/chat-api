const express = require('express')
const conversationController = require('../controllers/conversation')

const router = express.Router()

router.post('/create-conversation', conversationController.createConversation)

router.get('/conversations', conversationController.getConversations)

router.get('/:conversationId', conversationController.getConversation)

router.post('/:conversationId', conversationController.addMessage)

module.exports = router