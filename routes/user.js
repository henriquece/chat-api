const express = require('express')
const userController = require('../controllers/user')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.post('/create-conversation', isAuth, userController.createConversation)

router.get('/:email', userController.getUsers)

module.exports = router