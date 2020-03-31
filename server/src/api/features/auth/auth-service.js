const authDAL = require('./auth-dal');
const AppError = require('../../utils/app-error');

const createUser = async body => {
  const { email } = body;
  const userExists = (await authDAL.count(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  try {
    const user = await authDAL.create(body);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture
    };
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  createUser
};
