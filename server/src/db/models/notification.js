/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import(`${__dirname}/user.js`);

  const Notification = sequelize.define(
    'Notification',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      readAt: DataTypes.DATE
    },
    {
      paranoid: true,
      scopes: {
        full: {
          include: [
            'item',
            {
              model: User,
              as: 'toUser',
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: User,
              as: 'fromUser',
              attributes: ['id', 'name', 'avatar']
            }
          ]
        }
      }
    }
  );

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      as: 'toUser'
    });

    Notification.belongsTo(models.User, {
      as: 'fromUser'
    });

    Notification.belongsTo(models.Item, {
      as: 'item'
    });
  };

  return Notification;
};
