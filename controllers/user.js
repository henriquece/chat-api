const User = require('../models/user')

const getUsers = (req, res, next) => {
  const { params: { email } } = req

  User
    .find({ email })
    .then(users => {
      const usersInfo = users.map(user => {
        const { _id, email, name } = user

        return { _id, email, name }
      })

      res.json({ users: usersInfo })
    })
    .catch(error => {
      next(error)
    })
}

const updateSocketConnectionId = (userId, socketConnectionId) => {
  User
    .findById(userId)
    .then((user) => {
      user.socketConnectionId = socketConnectionId

      user.save()
    })
    .catch(error => {
    })
}

module.exports = { getUsers, updateSocketConnectionId }