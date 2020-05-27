const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const {
  SocketConnection,
  Chat,
  ChatUser,
  ChatMessage,
  User,
  Item,
  Notification
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

const readUserRooms = userId => SocketConnection.findAll({ where: { userId } });

const readOtherChatUser = (chatId, userId) =>
  ChatUser.findOne({
    where: { chatId, userId: { [Op.not]: userId } },
    include: [{ model: Chat, as: 'chat' }]
  });

const readOtherChatUserRooms = (chatId, userId) =>
  readOtherChatUser(chatId, userId).then(user => readUserRooms(user.userId));

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

const countUnreadNotifications = userId =>
  Notification.count({ where: { toUserId: userId, readAt: null } });

const createNotification = async (type, toUserId, fromUserId, itemId) =>
  Notification.create({ type, toUserId, fromUserId, itemId });

module.exports = {
  createConnection,
  destroyConnection,
  countChatUser,
  createChatMessage,
  markMessagesAsRead,
  readOtherChatUser,
  readOtherChatUserRooms,
  findChat,
  countUnreadNotifications,
  createNotification,
  readUserRooms
};
