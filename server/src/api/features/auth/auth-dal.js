const { User } = require('../../../db/models');

const create = payload => User.create(payload);
const count = email => {
  return User.count({
    where: {
      email
    }
  });
};

module.exports = {
  create,
  count
};
