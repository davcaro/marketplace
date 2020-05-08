/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      chatUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      readAt: {
        type: DataTypes.DATE
      }
    },
    { paranoid: true }
  );

  ChatMessage.associate = function(models) {
    ChatMessage.belongsTo(models.ChatUser, {
      as: 'ChatUser'
    });

    ChatMessage.belongsTo(models.User, {
      as: 'user'
    });
  };

  return ChatMessage;
};
