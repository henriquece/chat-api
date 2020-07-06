let io

const init = (server) => {
  io = require('socket.io')(server)

  return io
}

const getIO = () => {
  if (io) {
    return io
  }
  throw new Error('Socket.io not initialized')
}

module.exports = { init, getIO }