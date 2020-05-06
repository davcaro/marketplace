const socketDAL = require('./socket-dal');
const { createMessage } = require('./socket-validation');

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
    const chat = await socketDAL.findChatByUser(msg.chatUserId);

    return { message: msg, chat };
  } catch (e) {
    throw new Error(e.message);
  }
};

const readOtherChatUserRooms = async (userId, data) => {
  const { chatId } = data;

  try {
    return await socketDAL.readOtherChatUserRooms(chatId, userId);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  createConnection,
  deleteConnection,
  createChatMessage,
  readOtherChatUserRooms
};
