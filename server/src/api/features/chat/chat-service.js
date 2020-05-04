const chatDAL = require('./chat-dal');
const itemDAL = require('../item/item-dal');
const AppError = require('../../utils/app-error');

const readChats = async (id, query) => {
  const archived = !!(query && query.archived === '1');

  try {
    return await chatDAL.findAll(id, archived);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readMessages = async id => {
  try {
    return await chatDAL.findChat(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const findChat = async (userId, itemId) => {
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
    return await chatDAL.findChatByItem(userId, itemId);
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

module.exports = {
  readChats,
  readMessages,
  findChat,
  createMessage,
  updateChat,
  deleteChat,
  checkUser
};
