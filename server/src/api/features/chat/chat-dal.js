/* eslint-disable no-param-reassign */

const { Op } = require('sequelize');
const {
  Chat,
  ChatUser,
  ChatMessage,
  User,
  Item
} = require('../../../db/models');
const itemDal = require('../item/item-dal');

const findAll = async (id, archived) => {
  // Get all chat ids where the user is in and has messages
  let chatIds = await Chat.findAll({
    attributes: ['id'],
    group: ['id'],
    include: [
      {
        model: ChatUser,
        as: 'users',
        attributes: [],
        where: { userId: id, archived },
        include: [
          { model: ChatMessage, as: 'messages', attributes: [], required: true }
        ]
      }
    ]
  });
  chatIds = chatIds.map(chat => chat.id);

  const chats = await Chat.findAll({
    where: { id: { [Op.in]: chatIds } },
    include: [
      {
        model: ChatUser,
        as: 'users',
        include: [{ model: User.scope('public'), as: 'user' }]
      },
      { model: Item.scope('full'), as: 'item' }
    ]
  });

  chats.forEach(chat => {
    chat.item.dataValues = itemDal.countLengths(chat.item);
  });

  return chats;
};

const findChat = async (chatId, userId, pagination) => {
  const chat = await Chat.findByPk(chatId, {
    include: [
      {
        model: ChatUser,
        as: 'users',
        include: [{ model: User.scope('public'), as: 'user' }]
      },
      { model: Item.scope('full'), as: 'item' }
    ]
  });

  const chatUser = chat.users.find(user => user.userId === userId);
  const messages = await ChatMessage.findAndCountAll({
    where: { chatUserId: chatUser.id },
    ...pagination,
    order: [['createdAt', 'DESC']]
  });
  messages.rows.reverse();

  chat.dataValues.messages = messages;
  chat.item.dataValues = itemDal.countLengths(chat.item);

  return chat;
};

const createChat = (userId, itemId, pagination) =>
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
    .then(async chat => findChat(chat.id, userId, pagination));

const findChatByItem = (userId, itemId, pagination) =>
  Chat.findOne({
    attributes: ['id'],
    include: [{ model: ChatUser, as: 'users', where: { userId } }],
    where: { itemId }
  }).then(chat => {
    if (chat) {
      return findChat(chat.id, userId, pagination);
    }

    return createChat(userId, itemId, pagination);
  });

const createMessage = (chatId, userId, payload) => {
  Chat.findByPk(chatId, {
    include: [{ model: ChatUser, as: 'users' }]
  }).then(chat =>
    chat.users.forEach(user => {
      ChatMessage.create({ chatUserId: user.id, userId, ...payload });
    })
  );
};

const update = (chatId, userId, payload) =>
  ChatUser.update(payload, { where: { chatId, userId } });

const countUser = (chatId, userId) =>
  Chat.count({
    include: [{ model: ChatUser, as: 'users', where: { userId } }],
    where: { id: chatId }
  });

const deleteChat = (chatId, userId) => {
  ChatUser.findOne({
    attributes: ['id'],
    where: { chatId, userId }
  }).then(user => ChatMessage.destroy({ where: { chatUserId: user.id } }));
};

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
