const userDAL = require('./user-dal');
const AppError = require('../../utils/app-error');

const readUsers = async () => {
  try {
    return await userDAL.findAll();
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  readUsers
};
