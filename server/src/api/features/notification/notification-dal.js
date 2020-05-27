/* eslint-disable no-param-reassign */

const Sequelize = require('sequelize');
const { Notification } = require('../../../db/models');

const countUnreadNotifications = async userId =>
  Notification.count({ where: { toUserId: userId, readAt: null } });

const findNotifications = async userId =>
  Notification.scope('full').findAll({ where: { toUserId: userId } });

const createNotification = async (type, toUserId, fromUserId, itemId) =>
  Notification.create({ type, toUserId, fromUserId, itemId });

const markAsReadAll = async (userId, type) => {
  const where = { toUserId: userId };
  if (type !== 'all') {
    where.type = type;
  }

  return Notification.update({ readAt: Sequelize.fn('NOW') }, { where });
};

const markAsRead = async id =>
  Notification.update({ readAt: Sequelize.fn('NOW') }, { where: { id } });

const countNotification = async (id, userId) =>
  Notification.count({ where: { id, toUserId: userId } });

const deleteAll = async (userId, type) => {
  const where = { toUserId: userId };
  if (type !== 'all') {
    where.type = type;
  }

  return Notification.destroy({ where });
};

const deleteNotification = async id => Notification.destroy({ where: { id } });

module.exports = {
  countUnreadNotifications,
  findNotifications,
  createNotification,
  markAsReadAll,
  markAsRead,
  deleteAll,
  deleteNotification,
  countNotification
};
