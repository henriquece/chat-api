const express = require('express')
const conversationController = require('../controllers/conversation')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.get('/', isAuth, conversationController.getConversations)

router.post('/', isAuth, conversationController.postConversation)

module.exports = router