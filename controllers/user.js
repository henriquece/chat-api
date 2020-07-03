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

const getConversations = (req, res) => {
  const { userId } = req

  User
    .findById(userId)
    .populate({ path: 'conversations', populate: { path: 'users' } })
    .exec((error, user) => {
      if (error) {
        next(error)
      }

      const conversationsContacts = user.conversations.map(conversation => {
        const contact = conversation.users.find(user => user._id.toString() !== userId)

        return {
          id: contact.id,
          contactName: contact.name,
          lastMessage: {
            content: '',
            date: '',
          },
        }
      })

      res.status(200).json({
        conversations: conversationsContacts, 
      })
    })
}

const getUsers = (req, res) => {
  const { email } = req.params

  User
    .find({ email })
    .then(users => {
      const usersInfo = users.map(user => {
        const { _id, email, name } = user

        return { id: _id, email, name }
      })

      res.json({ users: usersInfo })
    })
    .catch(error => {
      next(error)
    })
}

module.exports = { createConversation, getConversations, getUsers }