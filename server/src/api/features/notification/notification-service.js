const notificationDAL = require('./notification-dal');
const AppError = require('../../utils/app-error');
const Socket = require('../../../socket');

const countUnreadNotifications = async userId => {
  try {
    return await notificationDAL.countUnreadNotifications(userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readNotifications = async userId => {
  try {
    return await notificationDAL.findNotifications(userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const createNotification = async (type, toUserId, fromUserId, itemId) => {
  try {
    const notification = await notificationDAL.createNotification(
      type,
      toUserId,
      fromUserId,
      itemId
    );

    Socket.sendNotificationsCount(toUserId);

    return notification;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const markAsReadAll = async (userId, body) => {
  try {
    return await notificationDAL.markAsReadAll(userId, body.type);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const markAsRead = async id => {
  try {
    return await notificationDAL.markAsRead(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteAll = async (userId, body) => {
  try {
    return await notificationDAL.deleteAll(userId, body.type);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteNotification = async id => {
  try {
    return await notificationDAL.deleteNotification(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const hasPermission = async (id, userId) => {
  try {
    return await notificationDAL.countNotification(id, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  countUnreadNotifications,
  readNotifications,
  createNotification,
  markAsReadAll,
  markAsRead,
  deleteAll,
  deleteNotification,
  hasPermission
};
