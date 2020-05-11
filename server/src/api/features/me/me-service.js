const meDAL = require('./me-dal');
const AppError = require('../../utils/app-error');
const Paginator = require('../../utils/paginator');

const readUser = async id => {
  try {
    return await meDAL.findById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
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
    if (body.location) {
      await meDAL.updateLocation(user.id, body.location);
    }

    updatedRows = await meDAL.updateById(user.id, payload);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return updatedRows;
};

const deleteUser = async id => {
  try {
    return await meDAL.deleteById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readFavorites = async (id, query) => {
  let items;

  try {
    items = await meDAL.findFavorites(id, {
      limit: +query.limit || null,
      offset: +query.offset || null
    });
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return Paginator.paginate(items, +query.limit, +query.offset);
};

const readReviews = async (id, query) => {
  const pending = !!(query && query.pending === '1');

  try {
    const reviews = await meDAL.findReviews(id, pending);

    return reviews;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateReview = async (id, userId, body) => {
  try {
    return await meDAL.updateReview(id, userId, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteReview = async (id, userId) => {
  try {
    return await meDAL.deleteReview(id, userId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

module.exports = {
  readUser,
  updateUser,
  deleteUser,
  readFavorites,
  readReviews,
  updateReview,
  deleteReview
};
