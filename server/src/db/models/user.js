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
      locationId: DataTypes.INTEGER,
      admin: DataTypes.BOOLEAN
    },
    {
      paranoid: true,
      scopes: {
        public: {
          attributes: ['id', 'name', 'email', 'avatar'],
          include: ['location']
        }
      }
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Item, {
      foreignKey: 'userId',
      as: 'items'
    });

    User.belongsTo(models.Location, {
      as: 'location'
    });

    User.hasMany(models.ChatUser, {
      foreignKey: 'userId',
      as: 'chats'
    });

    User.hasMany(models.ChatMessage, {
      foreignKey: 'userId',
      as: 'messages'
    });

    User.hasMany(models.SocketConnection, {
      foreignKey: 'userId',
      as: 'connections'
    });

    User.hasMany(models.Review, {
      foreignKey: 'fromUserId',
      as: 'ownReviews'
    });

    User.hasMany(models.Review, {
      foreignKey: 'toUserId',
      as: 'othersReviews'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'fromUserId',
      as: 'othersNotifications'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'toUserId',
      as: 'notifications'
    });
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
