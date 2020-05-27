const Boom = require('@hapi/boom');
const notificationService = require('./notification-service');

const countUnreadNotifications = async (req, res, next) => {
  const { id } = req.user;

  try {
    const notifications = await notificationService.countUnreadNotifications(
      id
    );

    return res.json(notifications);
  } catch (e) {
    return next(e);
  }
};

const getNotifications = async (req, res, next) => {
  const { id } = req.user;

  try {
    const notifications = await notificationService.readNotifications(id);

    return res.json(notifications);
  } catch (e) {
    return next(e);
  }
};

const markAsReadAll = async (req, res, next) => {
  const { id } = req.user;

  try {
    await notificationService.markAsReadAll(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const markAsRead = async (req, res, next) => {
  const { id } = req.params;

  try {
    await notificationService.markAsRead(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteAll = async (req, res, next) => {
  const { id } = req.user;

  try {
    await notificationService.deleteAll(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteNotification = async (req, res, next) => {
  const { id } = req.params;

  try {
    await notificationService.deleteNotification(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const hasPermission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userHasPermission = await notificationService.hasPermission(
      id,
      req.user.id
    );

    if (!userHasPermission) {
      return next(Boom.forbidden());
    }
  } catch (e) {
    return next(e);
  }

  return next();
};

module.exports = {
  countUnreadNotifications,
  getNotifications,
  markAsReadAll,
  markAsRead,
  deleteAll,
  deleteNotification,
  hasPermission
};
