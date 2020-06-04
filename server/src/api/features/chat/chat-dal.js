/* eslint-disable no-param-reassign,no-restricted-syntax,no-await-in-loop */

const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const {
  Chat,
  ChatUser,
  ChatMessage,
  User,
  Item
} = require('../../../db/models');
const itemDal = require('../item/item-dal');
const usersDal = require('../user/user-dal');

const findAll = async (userId, archived) => {
  // Get all chat ids where the user is in and has messages
  let chatIds = await Chat.findAll({
    attributes: ['id'],
    group: ['"Chat".id'],
    include: [
      {
        model: ChatUser,
        as: 'users',
        attributes: [],
        where: { userId, archived },
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

  for (const chat of chats) {
    chat.item.dataValues = itemDal.countLengths(chat.item);

    // Get unread messages
    const chatUser = chat.users.find(user => user.userId === userId);
    const unreadMessages = await ChatMessage.count({
      where: { chatUserId: chatUser.id, readAt: null }
    });

    chat.dataValues.unreadMessages = unreadMessages;
  }

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

  // Get user score
  for (const chatUser of chat.users) {
    const score = await usersDal.findUserScore(chatUser.user.id);
    chatUser.user.dataValues.score = score;
  }

  // Get messages
  const chatUser = chat.users.find(user => user.userId === userId);
  await ChatMessage.update(
    { readAt: Sequelize.fn('NOW') },
    { where: { readAt: null, chatUserId: chatUser.id } }
  );
  const messages = await ChatMessage.findAndCountAll({
    attributes: { exclude: ['ChatUserId'] },
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

const findUsersByItem = (itemId, userId) =>
  User.scope('public').findAll({
    where: { id: { [Op.not]: userId } },
    include: [
      {
        model: ChatUser,
        as: 'chats',
        attributes: [],
        include: [
          {
            model: Chat,
            as: 'chat',
            attributes: [],
            where: { itemId },
            required: true
          }
        ],
        required: true
      }
    ]
  });

const createMessage = async (chatId, userId, payload) => {
  Chat.findByPk(chatId, {
    include: [{ model: ChatUser, as: 'users' }]
  }).then(chat =>
    chat.users.forEach(user => {
      ChatMessage.create({
        chatUserId: user.id,
        userId,
        readAt: user.userId === userId ? Sequelize.fn('NOW') : null,
        ...payload
      });
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

const deleteChat = (chatId, userId) =>
  ChatUser.findOne({
    attributes: ['id'],
    where: { chatId, userId }
  }).then(user => ChatMessage.destroy({ where: { chatUserId: user.id } }));

const countItemOwner = (id, userId) => Item.count({ where: { id, userId } });

module.exports = {
  findAll,
  findChat,
  findChatByItem,
  findUsersByItem,
  createChat,
  createMessage,
  update,
  deleteChat,
  countUser,
  countItemOwner
};
