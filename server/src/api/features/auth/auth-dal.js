const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { User, PasswordReset, Location } = require('../../../db/models');

const create = payload => User.create(payload);

const findPasswordReset = userId =>
  PasswordReset.findOne({
    where: {
      userId,
      expirationDate: {
        [Op.gte]: Sequelize.fn('NOW')
      }
    }
  });

const createPasswordReset = (userId, token) =>
  PasswordReset.create({
    userId,
    tokenHash: token,
    expirationDate: Sequelize.literal("NOW() + '1 HOUR'"),
    tokenUsed: false
  });

const deletePasswordResets = userId =>
  PasswordReset.destroy({ where: { userId } });

const updateUserPassword = (id, password) =>
  User.update({ password }, { where: { id }, individualHooks: true });

const count = email => User.count({ where: { email }, paranoid: false });

const findByEmail = email => User.scope('public').findOne({ where: { email } });

const findLocationById = id => Location.findOne({ where: { id } });

module.exports = {
  create,
  findPasswordReset,
  createPasswordReset,
  deletePasswordResets,
  updateUserPassword,
  count,
  findByEmail,
  findLocationById
};
