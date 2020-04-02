const userDAL = require('./me-dal');
const AppError = require('../../utils/app-error');

const readUser = async id => {
  let user;

  try {
    user = await userDAL.findById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

const updateUser = async (user, body) => {
  let updatedRows;
  const payload = body;

  if (body.newPassword) {
    if (await user.isValidPassword(body.currentPassword)) {
      payload.password = body.newPassword;
    } else {
      throw new AppError(401, 'Bad Credentials');
    }
  }

  try {
    updatedRows = await userDAL.updateById(user.id, payload);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (updatedRows[0] === 0) {
    throw new AppError(404, 'User not found');
  }

  return updatedRows;
};

const deleteUser = async id => {
  let deletedRows;

  try {
    deletedRows = await userDAL.deleteById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (deletedRows === 0) {
    throw new AppError(404, 'User not found');
  }

  return deletedRows;
};

module.exports = {
  readUser,
  updateUser,
  deleteUser
};
