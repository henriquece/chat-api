const mongoose = require('mongoose')

const Schema = mongoose.Schema

const conversationSchema = new Schema({
  firstUser: {
    type: String,
    required: true
  },
  secondUser: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Conversation', conversationSchema)