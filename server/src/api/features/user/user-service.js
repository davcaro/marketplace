const userDAL = require('./user-dal');
const AppError = require('../../utils/app-error');

const readUsers = async () => {
  try {
    return await userDAL.findAll();
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

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

const createUser = async body => {
  const { email } = body;
  const userExists = (await userDAL.count(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  try {
    const user = await userDAL.create(body);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateUser = async (id, body) => {
  let updatedRows;

  try {
    updatedRows = await userDAL.updateById(id, body);
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
  readUsers,
  readUser,
  createUser,
  updateUser,
  deleteUser
};
