const Conversation = require('../models/conversation')
const User = require('../models/user')
const io = require('../utils/socket')

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
        _id: conversationCreated._id,
        contactId: contactData._id,
        contactName: contactData.name,
        messages: []
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

      const conversations = user.conversations.map(conversation => {
        const contact = conversation.users.find(user => user._id.toString() !== userId)

        return {
          _id: conversation._id,
          contactId: contact._id,
          contactName: contact.name,
          messages: conversation.messages
        }
      })

      res.status(200).json({
        conversations,
      })
    })
}

const addMessage = (req, res) => {
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
      const contact = conversation.users.find(user => user._id.toString() !== userId)

      const responseConversation = {
        _id: conversation._id,
        contactId: contact._id,
        contactName: contact.name,
        messages: conversation.messages
      }

      io.getIO().emit('message', { action: 'create', conversation: responseConversation })

      res.status(200).json({ message: 'Message added' })
    })
    .catch(error => {
      next(error)
    })
}

module.exports = { createConversation, getConversations, addMessage }