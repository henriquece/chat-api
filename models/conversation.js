const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date,
  content: String
})

const conversationSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  messages: [messageSchema]
})

module.exports = mongoose.model('Conversation', conversationSchema)