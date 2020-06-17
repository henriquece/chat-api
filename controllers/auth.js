const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const validate = require('../utils/validation')
const valueTypes = require('../constants/valueTypes')

const signup = (req, res, next) => {
  const { email, password } = req.body

  validate(email, valueTypes.email)
    .then(() => {
      return User.findOne({ email: email })
    })
    .then(user => {
      if (!user) {
        return bcryptjs.hash(password, 12)
      } else {
        const error = new Error('Email address already exists')
        error.status = 401

        throw error
      }
    })
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword
      })

      return user.save()
    })
    .then(user => {
      res.status(201).json({ message: 'User created', email: user.email })
    })
    .catch(error => {
      next(error)
    })
}

const signin = (req, res, next) => {
  const { email, password } = req.body

  let requestUser

  User
    .findOne({ email: email })
    .then(user => {
      if (user) {
        requestUser = user

        return bcryptjs.compare(password, user.password)
      }
      const error = new Error('This email could not be found')
      error.status = 401

      throw error
    })
    .then(isPasswordCorrect => {
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            email: requestUser.email,
            id: requestUser._id.toString()
          },
          'chatsecret',
          { expiresIn: '1h' }
        )
          
        res.status(200).json({ token: token, id: requestUser._id.toString() })
      } else {
        const error = new Error('Wrong password')
        error.status = 401

        throw error
      }
    })
    .catch(error => {
      console.log('catch', error)

      next(error)
    })
}

module.exports = { signup, signin }