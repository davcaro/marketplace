const socketDAL = require('./socket-dal');
const { createMessage, markMessagesRead } = require('./socket-validation');

const createConnection = async (userId, socketId) => {
  try {
    return await socketDAL.createConnection(userId, socketId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteConnection = async socketId => {
  try {
    return await socketDAL.destroyConnection(socketId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const hasPermission = async (userId, chatId) => {
  let userHasPermission;

  try {
    userHasPermission = await socketDAL.countChatUser(chatId, userId);
  } catch (e) {
    throw new Error(e.message);
  }

  if (!userHasPermission) {
    throw new Error('Forbidden');
  }

  return userHasPermission;
};

const createChatMessage = async (userId, data) => {
  const validatedData = createMessage.validate(data);
  if (validatedData.error) {
    throw new Error(validatedData.error);
  }

  const { chatId, message } = validatedData.value;

  try {
    await hasPermission(userId, chatId);

    const msg = await socketDAL.createChatMessage(chatId, userId, message);
    const chat = await socketDAL.findChat(chatId);

    return { message: msg, chat };
  } catch (e) {
    throw new Error(e.message);
  }
};

const markMessagesAsRead = async (userId, data) => {
  const validatedData = markMessagesRead.validate(data);
  if (validatedData.error) {
    throw new Error(validatedData.error);
  }

  const { chatId } = validatedData.value;

  try {
    return await socketDAL.markMessagesAsRead(chatId, userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const readOtherChatUser = async (chatId, userId) => {
  try {
    return await socketDAL.readOtherChatUser(chatId, userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const readOtherChatUserRooms = async (chatId, userId) => {
  try {
    return await socketDAL.readOtherChatUserRooms(chatId, userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const countUnreadNotifications = async userId => {
  try {
    return await socketDAL.countUnreadNotifications(userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const createNotification = async (type, toUserId, fromUserId, itemId) => {
  try {
    return await socketDAL.createNotification(
      type,
      toUserId,
      fromUserId,
      itemId
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

const readUserRooms = async userId => {
  try {
    return await socketDAL.readUserRooms(userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  createConnection,
  deleteConnection,
  createChatMessage,
  markMessagesAsRead,
  readOtherChatUser,
  readOtherChatUserRooms,
  countUnreadNotifications,
  createNotification,
  readUserRooms
};
