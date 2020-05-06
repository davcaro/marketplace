/* eslint-disable consistent-return */

const socketIO = require('socket.io');
const jwtDecode = require('jwt-decode');
const socketService = require('./socket-service');
const logger = require('./logger');

const throwError = (socket, message) => {
  logger.error(message);
  socket.emit('app error', message);
};

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
    socketService.createConnection(user.id, socket.id);

    socket.on('disconnect', () => {
      socketService.deleteConnection(socket.id);
    });

    socket.on('message sent', async data => {
      try {
        const message = await socketService.createChatMessage(user.id, data);

        const rooms = await socketService.readOtherChatUserRooms(user.id, data);

        rooms.forEach(room => {
          io.to(room.socketId).emit('message received', message);
        });
      } catch (e) {
        return throwError(socket, e.message);
      }
    });
  });
};
