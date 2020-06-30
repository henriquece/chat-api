const express = require('express')
const userController = require('../controllers/user')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.get('/:email', userController.getUsers)

module.exports = router