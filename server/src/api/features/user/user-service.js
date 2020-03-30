const userDAL = require('./user-dal');

const readUsers = async () => {
  try {
    return await userDAL.findAll();
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  readUsers
};
