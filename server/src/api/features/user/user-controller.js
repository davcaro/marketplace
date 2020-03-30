const userService = require('./user-service');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.readUsers();

    return res.json(users);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUsers
};
