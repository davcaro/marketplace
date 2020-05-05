const socketIO = require('socket.io');
const jwtDecode = require('jwt-decode');
const socketService = require('./socket-service');

module.exports = server => {
  // Socket.io setup
  const io = socketIO.listen(server);

  // Events
  io.on('connection', socket => {
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return;
    }

    const { token } = socket.handshake.query;
    const user = jwtDecode(token);
    socketService.createConnection(user.id, socket);

    socket.on('disconnect', () => {
      socketService.deleteConnection(socket);
    });
  });
};
