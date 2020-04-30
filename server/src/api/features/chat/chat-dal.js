const { Chat } = require('../../../db/models');
const { ChatUser } = require('../../../db/models');
const { ChatMessage } = require('../../../db/models');
const { Item } = require('../../../db/models');

const findAll = (id, archived) =>
  Chat.findAll({
    include: [
      { model: ChatUser, as: 'users', where: { userId: id, archived } },
      { model: Item.scope('full'), as: 'item' }
    ]
  });

const findChat = (userId, itemId) =>
  Chat.findOne({
    attributes: ['id'],
    include: [
      { model: ChatUser, as: 'users', where: { userId } },
      { model: Item.scope('full'), as: 'item' }
    ],
    where: { itemId }
  }).then(chat => {
    if (chat) {
      return Chat.findByPk(chat.id, {
        include: [
          { model: ChatUser, as: 'users' },
          { model: ChatMessage, as: 'messages' },
          { model: Item.scope('full'), as: 'item' }
        ]
      });
    }

    return chat;
  });

const findMessages = chatId =>
  ChatMessage.findAll({ where: { chatId }, order: ['createdAt'] });

const createChat = (userId, payload) =>
  Chat.create({ itemId: payload.itemId })
    .then(async chat => {
      await ChatUser.bulkCreate([
        { chatId: chat.id, userId },
        { chatId: chat.id, userId: payload.userId }
      ]);

      return chat;
    })
    .then(async chat => {
      await ChatMessage.create({
        chatId: chat.id,
        userId,
        message: payload.message
      });

      return chat;
    })
    .then(chat =>
      Chat.findByPk(chat.id, {
        include: [
          { model: ChatUser, as: 'users' },
          { model: ChatMessage, as: 'messages' },
          { model: Item.scope('full'), as: 'item' }
        ]
      })
    );

const createMessage = (chatId, userId, payload) =>
  ChatMessage.create({ chatId, userId, ...payload });

const update = (chatId, userId, payload) =>
  ChatUser.update(payload, { where: { chatId, userId } });

const countUser = (chatId, userId) =>
  Chat.count({
    include: [{ model: ChatUser, as: 'users', where: { userId } }],
    where: { id: chatId }
  });

const deleteChat = (chatId, userId) =>
  ChatUser.destroy({ where: { chatId, userId } });

module.exports = {
  findAll,
  findChat,
  findMessages,
  createChat,
  createMessage,
  update,
  deleteChat,
  countUser
};
