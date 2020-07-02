const jwt = require('jsonwebtoken')

const getToken = (_id, email) => {
  return jwt.sign(
    {
      email: email,
      id: _id.toString()
    },
    'secret',
    { expiresIn: '1h' }
  )
}

module.exports = { getToken }