const socketDAL = require('./socket-dal');
const logger = require('./logger');

const throwError = (socket, error) => {
  logger.error(error.message);
  socket.emit('app error', error.message);
};

const createConnection = async (userId, socket) => {
  try {
    return await socketDAL.createConnection(userId, socket.id);
  } catch (e) {
    return throwError(socket, e);
  }
};

const deleteConnection = async socket => {
  try {
    return await socketDAL.destroyConnection(socket.id);
  } catch (e) {
    return throwError(socket, e);
  }
};

module.exports = {
  createConnection,
  deleteConnection
};
