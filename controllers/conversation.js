const Conversation = require('../models/conversation')
const User = require('../models/user')

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
          id: conversation._id,
          contactId: contact._id,
          contactName: contact.name,
          lastMessage: {
            content: '',
            date: 1,
          },
        }
      })

      res.status(200).json({
        conversations: conversationsContacts,
      })
    })
}

const getConversation = (req, res) => {
  const { params: { conversationId } } = req

  Conversation
    .findById(conversationId)
    .then(conversation => {
      res.status(200).json({
        id: conversation._id,
        messages: conversation.messages,
      })
    })
    .catch(error => {
      next(error)
    })
}

const addMessage = (req, res) => {
  const { userId, params: { conversationId }, body: { date, content } } = req

  const newMessage = { userId, date, content }

  console.log('aqui', conversationId, newMessage);

  Conversation
    .findById(conversationId)
    .then(conversation => {
      conversation.messages.push(newMessage)

      return conversation.save()
    })
    .then(() => {
      res.status(200).json({
        message: 'Message added',
      })
    })
    .catch(error => {
      next(error)
    })
}

module.exports = { createConversation, getConversations, getConversation, addMessage }