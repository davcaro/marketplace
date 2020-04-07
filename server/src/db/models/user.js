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
      avatar: DataTypes.STRING,
      location: DataTypes.STRING,
      admin: DataTypes.BOOLEAN
    },
    {
      paranoid: true,
      scopes: {
        public: {
          attributes: ['id', 'name', 'email', 'avatar', 'location']
        }
      }
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Article, { as: 'articles' });
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

  User.prototype.isAdmin = function() {
    const user = this;

    return !!user.admin;
  };

  return User;
};
