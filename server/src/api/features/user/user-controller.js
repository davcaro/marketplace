const userService = require('./user-service');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.readUsers();

    return res.json(users);
  } catch (e) {
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.readUser(id);

    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

const getUserArticles = async (req, res, next) => {
  const { id } = req.params;

  try {
    const articles = await userService.readUserArticles(id, req.query);

    return res.json(articles);
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    await userService.updateUser(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserArticles,
  createUser,
  updateUser,
  deleteUser
};
