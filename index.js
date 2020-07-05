const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const conversationRoutes = require('./routes/conversation')
const isAuth = require('./middlewares/isAuth')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use('/auth', authRoutes)
app.use('/user', isAuth, userRoutes)
app.use('/conversation', isAuth, conversationRoutes)

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message

  res.status(status).json({ message: message })
})

mongoose
  .connect('mongodb+srv://henrique:mongohenriquen@cluster0-un9ta.mongodb.net/chat-api?retryWrites=true')
  .then(() => {
    app.listen(3000)
  })
  .catch(error => console.log(error))
