const authDAL = require('./auth-dal');

const createUser = async body => {
  try {
    const { email, password } = body;

    return await authDAL.create({ email, password });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  createUser
};
