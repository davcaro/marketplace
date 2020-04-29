/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      chatId: {
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
      }
    },
    { paranoid: true }
  );

  ChatMessage.associate = function(models) {
    ChatMessage.belongsTo(models.Chat, {
      as: 'chat'
    });

    ChatMessage.belongsTo(models.User, {
      as: 'user'
    });
  };

  return ChatMessage;
};
