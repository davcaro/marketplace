const authDAL = require('./auth-dal');
const AppError = require('../../utils/app-error');

const createUser = async body => {
  try {
    const { email, password, name, picture } = body;

    return await authDAL.create({ email, password, name, picture });
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  createUser
};
