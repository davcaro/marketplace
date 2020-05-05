const { SocketConnection } = require('../db/models');

const createConnection = (userId, socketId) =>
  SocketConnection.create({ userId, socketId });

const destroyConnection = socketId =>
  SocketConnection.destroy({ where: { socketId } });

module.exports = {
  createConnection,
  destroyConnection
};
