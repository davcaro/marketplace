/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: DataTypes.STRING,
      picture: DataTypes.STRING,
      admin: DataTypes.BOOLEAN
    },
    {
      scopes: {
        public: {
          attributes: ['id', 'name', 'email', 'picture']
        }
      }
    }
  );

  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  User.prototype.isValidPassword = function(password) {
    const user = this;

    return bcrypt.compare(password, user.password);
  };

  return User;
};
