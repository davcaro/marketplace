/* eslint-disable consistent-return */

const socketIO = require('socket.io');
const jwtDecode = require('jwt-decode');
const socketService = require('./socket-service');
const logger = require('./logger');

let io;

const throwError = (message, socket) => {
  logger.error(message);

  if (socket) {
    socket.emit('app error', message);
  }
};

const sendNotificationsCount = async userId => {
  try {
    const count = await socketService.countUnreadNotifications(userId);

    const rooms = await socketService.readUserRooms(userId);
    rooms.forEach(room => {
      io.to(room.socketId).emit('notifications count', count);
    });
  } catch (e) {
    return throwError(e.message);
  }
};

const createNotification = async (type, toUserId, fromUserId, itemId) => {
  try {
    const notification = await socketService.createNotification(
      type,
      toUserId,
      fromUserId,
      itemId
    );

    sendNotificationsCount(toUserId);

    return notification;
  } catch (e) {
    return throwError(e.message);
  }
};

const setUp = server => {
  // Socket.io setup
  io = socketIO.listen(server);

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

        const otherChatUser = await socketService.readOtherChatUser(
          data.chatId,
          user.id
        );
        await createNotification(
          'new_message',
          otherChatUser.userId,
          user.id,
          otherChatUser.chat.itemId
        );

        const rooms = await socketService.readOtherChatUserRooms(
          data.chatId,
          user.id
        );
        rooms.forEach(room => {
          io.to(room.socketId).emit('message received', message);
        });
      } catch (e) {
        return throwError(e.message, socket);
      }
    });

    socket.on('messages read', async data => {
      try {
        await socketService.markMessagesAsRead(user.id, data);
      } catch (e) {
        return throwError(e.message, socket);
      }
    });
  });
};

module.exports = {
  setUp,
  sendNotificationsCount,
  createNotification
};
