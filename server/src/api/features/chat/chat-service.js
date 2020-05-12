const chatDAL = require('./chat-dal');
const itemDAL = require('../item/item-dal');
const AppError = require('../../utils/app-error');
const Paginator = require('../../utils/paginator');

const readChats = async (id, query) => {
  const archived = !!(query && query.archived === '1');

  try {
    return await chatDAL.findAll(id, archived);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readMessages = async (id, userId, query) => {
  const pagination = {
    limit: query.limit ? +query.limit : null,
    offset: query.offset ? +query.offset : null
  };

  try {
    const chat = await chatDAL.findChat(id, userId, pagination);

    chat.dataValues.messages = Paginator.paginate(
      chat.dataValues.messages,
      pagination.limit,
      pagination.offset
    );

    return chat;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const findChat = async (userId, itemId, query) => {
  let item;

  try {
    item = await itemDAL.count(itemId);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  const pagination = {
    limit: query.limit ? +query.limit : null,
    offset: query.offset ? +query.offset : null
  };

  try {
    const chat = await chatDAL.findChatByItem(userId, itemId, pagination);

    chat.dataValues.messages = Paginator.paginate(
      chat.dataValues.messages,
      pagination.limit,
      pagination.offset
    );

    return chat;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readUsers = async (itemId, userId) => {
  let item;

  try {
    item = await itemDAL.count(itemId);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  try {
    return await chatDAL.findUsersByItem(itemId, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const createMessage = async (chatId, userId, body) => {
  try {
    return await chatDAL.createMessage(chatId, userId, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateChat = async (chatId, userId, body) => {
  try {
    return await chatDAL.update(chatId, userId, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const checkUser = async (chatId, userId) => {
  try {
    return await chatDAL.countUser(chatId, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteChat = async (chatId, userId) => {
  try {
    return await chatDAL.deleteChat(chatId, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const countItemOwner = async (itemId, userId) => {
  try {
    return await chatDAL.countItemOwner(itemId, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  readChats,
  readMessages,
  findChat,
  readUsers,
  createMessage,
  updateChat,
  deleteChat,
  checkUser,
  countItemOwner
};
