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
      avatar: user.avatar,
      location: user.location
    };
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const checkUserExists = async email => {
  const userExists = (await authDAL.count(email)) > 0;

  if (userExists) {
    throw new AppError(409, 'User already registered');
  }

  return userExists;
};

const readLocation = async locationId => {
  let location;

  try {
    location = await authDAL.findLocationById(locationId);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!location) {
    throw new AppError(404, 'Location not found');
  }

  return location;
};

module.exports = {
  createUser,
  checkUserExists,
  readLocation
};
