const authDAL = require('./auth-dal');
const AppError = require('../../utils/app-error');

const createUser = async body => {
  try {
    return await authDAL.create(body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  createUser
};
