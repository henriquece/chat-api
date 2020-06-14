const Conversation = require('../models/conversation')

const getConversations = (req, res) => {
  Conversation
    .find()
    .then(conversations => {
      res.json({ conversations })
    })
    .catch(error => console.log(error))
}

const postConversation = (req, res) => {
  const conversation = new Conversation({
    firstUser: 'Joao',
    secondUser: 'Pedro'
  })

  conversation
    .save()
    .then(result => {
      console.log('postConversation result', result)

      res.json({
        result
      })
    })
    .catch(error => {
      console.log(error)
    })
}

module.exports = { getConversations, postConversation }