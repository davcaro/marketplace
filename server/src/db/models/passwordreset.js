/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define(
    'PasswordReset',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    { paranoid: true }
  );

  PasswordReset.associate = function(models) {
    PasswordReset.belongsTo(models.User, {
      as: 'user'
    });
  };

  PasswordReset.beforeCreate(async (passwordReset, options) => {
    const hashedToken = await bcrypt.hash(passwordReset.tokenHash, 10);
    passwordReset.tokenHash = hashedToken;
  });

  PasswordReset.prototype.isValidToken = function(token) {
    const passwordReset = this;

    return bcrypt.compare(token, passwordReset.tokenHash);
  };

  return PasswordReset;
};
