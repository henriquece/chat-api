const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const authorizationHeader = req.get('Authorization')

  if (!authorizationHeader) {
    const error = new Error('Not authenticated')
    error.status = 401

    throw error
  }
  const token = authorizationHeader.split(' ')[1]

  let decodedToken

  try {
    decodedToken = jwt.verify(token, 'secret')
  } catch (error) {
    error.status = 401

    throw error
  }

  req.userId = decodedToken.id

  next()
}

module.exports = isAuth