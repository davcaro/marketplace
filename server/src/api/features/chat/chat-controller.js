const Boom = require('@hapi/boom');
const chatService = require('./chat-service');

const getChats = async (req, res, next) => {
  const { id } = req.user;

  try {
    const chats = await chatService.readChats(id, req.query);

    return res.json(chats);
  } catch (e) {
    return next(e);
  }
};

const getMessages = async (req, res, next) => {
  const { id } = req.params;

  try {
    const messages = await chatService.readMessages(id, req.user.id);

    return res.json(messages);
  } catch (e) {
    return next(e);
  }
};

const findChat = async (req, res, next) => {
  const { itemId } = req.query;

  try {
    const chat = await chatService.findChat(req.user.id, itemId);

    return res.json(chat);
  } catch (e) {
    return next(e);
  }
};

const createMessage = async (req, res, next) => {
  const { id } = req.params;

  try {
    const message = await chatService.createMessage(id, req.user.id, req.body);

    return res.json(message);
  } catch (e) {
    return next(e);
  }
};

const updateChat = async (req, res, next) => {
  const { id } = req.params;

  try {
    await chatService.updateChat(id, req.user.id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const hasPermission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userHasPermission = await chatService.checkUser(id, req.user.id);

    if (!userHasPermission) {
      return next(Boom.forbidden());
    }
  } catch (e) {
    return next(e);
  }

  return next();
};

const deleteChat = async (req, res, next) => {
  const { id } = req.params;

  try {
    await chatService.deleteChat(id, req.user.id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getChats,
  getMessages,
  findChat,
  createMessage,
  updateChat,
  deleteChat,
  hasPermission
};
