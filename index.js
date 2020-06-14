const express = require('express')
const mongoose = require('mongoose')
const conversationRoutes = require('./routes/conversation')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

app.use('/conversation', conversationRoutes)

mongoose
  .connect('mongodb+srv://henrique:mongohenriquen@cluster0-un9ta.mongodb.net/chat-api?retryWrites=true')
  .then(() => {
    app.listen(3000)
  })
  .catch(error => console.log(error))
