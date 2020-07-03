const express = require('express')
const userController = require('../controllers/user')

const router = express.Router()

router.post('/create-conversation', userController.createConversation)

router.get('/conversations', userController.getConversations)

router.get('/:email', userController.getUsers)

module.exports = router