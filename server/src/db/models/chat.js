/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { paranoid: true }
  );

  Chat.associate = function(models) {
    Chat.belongsTo(models.Item, {
      as: 'item'
    });

    Chat.hasMany(models.ChatUser, {
      foreignKey: 'chatId',
      as: 'users'
    });
  };

  return Chat;
};
