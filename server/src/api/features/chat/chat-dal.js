/* eslint-disable no-param-reassign */

const { Chat } = require('../../../db/models');
const { ChatUser } = require('../../../db/models');
const { ChatMessage } = require('../../../db/models');
const { Item } = require('../../../db/models');
const itemDal = require('../item/item-dal');

const findAll = async (id, archived) => {
  const chats = await Chat.findAll({
    include: [
      { model: ChatUser, as: 'users', where: { userId: id, archived } },
      { model: Item.scope('full'), as: 'item' },
      { model: ChatMessage, as: 'messages', required: true }
    ]
  });

  chats.forEach(chat => {
    chat.item.dataValues = itemDal.countLengths(chat.item);
  });

  return chats;
};

const findChat = async chatId => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      { model: ChatUser, as: 'users' },
      { model: Item.scope('full'), as: 'item' },
      { model: ChatMessage, as: 'messages', order: ['createdAt'] }
    ]
  });

  chat.item.dataValues = itemDal.countLengths(chat.item);

  return chat;
};

const createChat = (userId, itemId) =>
  Chat.create({ itemId })
    .then(async chat => {
      const item = await Item.findByPk(itemId, {
        attributes: ['userId']
      });

      await ChatUser.bulkCreate([
        { chatId: chat.id, userId },
        { chatId: chat.id, userId: item.userId }
      ]);

      return chat;
    })
    .then(async chat => {
      const newChat = await Chat.findByPk(chat.id, {
        include: [
          { model: ChatUser, as: 'users' },
          { model: ChatMessage, as: 'messages' },
          { model: Item.scope('full'), as: 'item' }
        ]
      });

      newChat.item.dataValues = itemDal.countLengths(newChat.item);

      return newChat;
    });

const findChatByItem = (userId, itemId) =>
  Chat.findOne({
    attributes: ['id'],
    include: [{ model: ChatUser, as: 'users', where: { userId } }],
    where: { itemId }
  }).then(chat => {
    if (chat) {
      return findChat(chat.id);
    }

    return createChat(userId, itemId);
  });

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
  findChatByItem,
  createChat,
  createMessage,
  update,
  deleteChat,
  countUser
};
