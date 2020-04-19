const { Op } = require('sequelize');
const userDAL = require('./user-dal');
const articlesDAL = require('../article/article-dal');
const AppError = require('../../utils/app-error');
const Paginator = require('../../utils/paginator');

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

const readUserArticles = async (id, query) => {
  let user;
  let articles;

  try {
    user = await userDAL.countById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const where = {
    userId: id
  };

  if (query.status) {
    where.status = query.status;
  } else {
    where[Op.or] = [
      {
        status: 'for_sale'
      },
      {
        status: 'reserved'
      }
    ];
  }

  try {
    articles = await articlesDAL.findAndPaginate({
      where,
      limit: +query.limit || null,
      offset: +query.offset || null
    });
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return Paginator.paginate(articles, +query.limit, +query.offset);
};

const createUser = async body => {
  const { email } = body;
  const userExists = (await userDAL.countByEmail(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  try {
    const user = await userDAL.create(body);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      location: user.location
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
  readUserArticles,
  createUser,
  updateUser,
  deleteUser
};
