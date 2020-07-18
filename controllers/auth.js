const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const validate = require('../utils/validation')
const valueTypes = require('../constants/valueTypes')
const { getToken } = require('../utils/auth')

const signup = (req, res, next) => {
  const { email, name, password } = req.body

  validate(email, valueTypes.email)
    .then(() => {
      return validate(name, valueTypes.name)
    })
    .then(() => {
      return User.findOne({ email: email })
    })
    .then(user => {
      if (!user) {
        return bcryptjs.hash(password, 12)
      } else {
        const error = new Error('email address already exists')
        error.status = 401

        throw error
      }
    })
    .then(hashedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword
      })

      return user.save()
    })
    .then(user => {
      const { _id, email, name } = user

      const token = getToken(_id, email)

      res.status(201).json({
        userId: _id.toString(),
        userName: name,
        message: 'User created',
        token: token,
      })
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
      const error = new Error('email incorrect')
      error.status = 401

      throw error
    })
    .then(isPasswordCorrect => {
      if (isPasswordCorrect) {
        const { _id, email, name } = requestUser

        const token = getToken(_id, email)

        res.status(200).json({ userId: _id.toString(), userName: name, token: token })
      } else {
        const error = new Error('password incorrect')
        error.status = 401

        throw error
      }
    })
    .catch(error => {
      next(error)
    })
}

module.exports = { signup, signin }