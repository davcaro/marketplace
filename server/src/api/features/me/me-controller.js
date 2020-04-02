const meService = require('./me-service');

const getUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await meService.readUser(id);

    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    await meService.updateUser(req.user, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    await meService.deleteUser(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser
};
