const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const {
  SocketConnection,
  Chat,
  ChatUser,
  ChatMessage,
  User,
  Item
} = require('../db/models');

const createConnection = (userId, socketId) =>
  SocketConnection.create({ userId, socketId });

const destroyConnection = socketId =>
  SocketConnection.destroy({ where: { socketId } });

const countChatUser = (chatId, userId) =>
  Chat.count({
    include: [{ model: ChatUser, as: 'users', where: { userId } }],
    where: { id: chatId }
  });

const createChatMessage = (chatId, userId, message) =>
  Chat.findByPk(chatId, {
    include: [{ model: ChatUser, as: 'users' }]
  }).then(chat => {
    let chatMessage;

    chat.users.forEach(user => {
      const msg = ChatMessage.create({
        chatUserId: user.id,
        userId,
        message,
        readAt: user.userId === userId ? Sequelize.fn('NOW') : null
      });

      if (user.userId !== userId) {
        chatMessage = msg;
      }
    });

    return chatMessage;
  });

const markMessagesAsRead = (chatId, userId) =>
  ChatUser.findOne({
    attributes: ['id'],
    where: { chatId, userId }
  }).then(user =>
    ChatMessage.update(
      { readAt: Sequelize.fn('NOW') },
      { where: { readAt: null, chatUserId: user.id } }
    )
  );

const readOtherChatUserRooms = (chatId, userId) =>
  ChatUser.findOne({
    where: { chatId, userId: { [Op.not]: userId } }
  }).then(user => SocketConnection.findAll({ where: { userId: user.userId } }));

const findChat = chatId =>
  Chat.findByPk(chatId, {
    include: [
      {
        model: ChatUser,
        as: 'users',
        include: { model: User.scope('public'), as: 'user' }
      },
      { model: Item.scope('full'), as: 'item' }
    ]
  });

module.exports = {
  createConnection,
  destroyConnection,
  countChatUser,
  createChatMessage,
  markMessagesAsRead,
  readOtherChatUserRooms,
  findChat
};
