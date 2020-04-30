const chatDAL = require('./chat-dal');
const itemDAL = require('../item/item-dal');
const userDAL = require('../user/user-dal');
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
    return await chatDAL.findMessages(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const findChat = async (userId, itemId) => {
  try {
    return await chatDAL.findChat(userId, itemId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const createChat = async (userId, body) => {
  let item;
  let user;

  try {
    item = await itemDAL.count(body.itemId);
    user = await userDAL.countById(body.userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }
  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  try {
    return await chatDAL.createChat(userId, body);
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
  createChat,
  createMessage,
  updateChat,
  deleteChat,
  checkUser
};
