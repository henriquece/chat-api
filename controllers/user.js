const User = require('../models/user')

const getUsers = (req, res) => {
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

module.exports = { getUsers }