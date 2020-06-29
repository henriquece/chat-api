const jwt = require('jsonwebtoken')

const getToken = (_id, email) => {
  return jwt.sign(
    {
      email: email,
      userId: _id.toString()
    },
    'somesupersecretsecret',
    { expiresIn: '1h' }
  )
}

module.exports = { getToken }