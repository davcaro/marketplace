const { Op } = require('sequelize');
const userDAL = require('./user-dal');
const itemsDAL = require('../item/item-dal');
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

const readUserItems = async (id, query) => {
  let user;
  let items;

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
    items = await itemsDAL.findAndPaginate({
      where,
      distinct: true,
      col: 'Item.id',
      limit: +query.limit || null,
      offset: +query.offset || null
    });
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return Paginator.paginate(items, +query.limit, +query.offset);
};

const countUserItems = async userId => {
  try {
    return await userDAL.countUserItems(userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readUserReviews = async id => {
  let user;

  try {
    user = await userDAL.countById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  try {
    return await userDAL.findUserReviews(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readUserScore = async id => {
  let user;

  try {
    user = await userDAL.countById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  try {
    return await userDAL.findUserScore(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const createUser = async body => {
  const payload = { ...body };

  const userExists = (await userDAL.countByEmail(payload.email)) > 0;
  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  try {
    if (payload.location) {
      const location = await userDAL.createLocation(payload);
      payload.locationId = location.id;
    }

    const user = await userDAL.create(payload);

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
    if (body.location) {
      await userDAL.updateLocation(id, body.location);
    }

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
  readUserItems,
  countUserItems,
  readUserReviews,
  readUserScore,
  createUser,
  updateUser,
  deleteUser
};
