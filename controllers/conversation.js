const Conversation = require('../models/conversation')
const User = require('../models/user')
const io = require('../utils/socket')

const createConversation = (req, res, next) => {
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
      const users = conversationCreated.users.map(user => ({
        _id: user._id,
        name: user.name
      }))

      res.status(200).json({
        _id: conversationCreated._id,
        users: users,
        messages: []
      })
    })
    .catch(error => {
      next(error)
    })
}

const getConversations = (req, res, next) => {
  const { userId } = req

  User
    .findById(userId)
    .populate({ path: 'conversations', populate: { path: 'users' } })
    .exec((error, user) => {
      if (error) {
        next(error)
      }

      const conversations = user.conversations.map(conversation => {
        const users = conversation.users.map(user => ({
          _id: user._id,
          name: user.name
        }))

        return {
          _id: conversation._id,
          users: users,
          messages: conversation.messages
        }
      })

      res.status(200).json(conversations)
    })
}

const addMessage = (req, res, next) => {
  const { userId, params: { conversationId }, body: { date, content } } = req

  const newMessage = { userId, date, content }

  Conversation
    .findById(conversationId)
    .populate({ path: 'users' })
    .exec()
    .then((conversation) => {
      conversation.messages.push(newMessage)

      return conversation.save()
    })
    .then((conversation) => {
      const users = conversation.users.map(user => ({
        _id: user._id,
        name: user.name
      }))

      const responseConversation = {
        _id: conversation._id,
        users: users,
        messages: conversation.messages
      }

      const conversationUsersSocketConnectionIds = conversation.users.map(user => user.socketConnectionId)

      conversationUsersSocketConnectionIds.forEach(socketConnectionId => {
        if (socketConnectionId) {
          io.getIO().to(socketConnectionId).emit('message', { action: 'create', conversation: responseConversation })
        }
      })

      res.status(200).json({ message: 'Message added' })
    })
    .catch(error => {
      next(error)
    })
}

module.exports = { createConversation, getConversations, addMessage }