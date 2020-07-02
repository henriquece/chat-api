const User = require('../models/user')
const Conversation = require('../models/conversation');

const createConversation = (req, res) => {
  const { userId, body: { contactId } } = req

  let userData
  let contactData
  let conversationCreated

  User
    .findById(userId)
    .then(user => {
      userData = user

      return User.findById(contactId)
    })
    .then(contact => {
      contactData = contact

      const conversation = new Conversation({
        users: [userData, contactData]
      })

      conversationCreated = conversation

      return conversation.save()
    })
    .then(() => {
      userData.conversations.push(conversationCreated)

      return userData.save()
    })
    .then(() => {
      contactData.conversations.push(conversationCreated)

      return contactData.save()
    })
    .then(() => {
      res.status(200).json({
        message: 'Conversation created',
      })
    })
    .catch(error => {
      next(error)
    })
}

const getUsers = (req, res) => {
  const { email } = req.params

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

module.exports = { createConversation, getUsers }