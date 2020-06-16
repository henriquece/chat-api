const bcryptjs = require('bcryptjs')
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

}

module.exports = { signup, signin }