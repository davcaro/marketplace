/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatUser = sequelize.define(
    'ChatUser',
    {
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      archived: DataTypes.BOOLEAN
    },
    { paranoid: true }
  );

  ChatUser.associate = function(models) {
    ChatUser.belongsTo(models.Chat, {
      as: 'chat'
    });

    ChatUser.belongsTo(models.User, {
      as: 'user'
    });

    ChatUser.hasMany(models.ChatMessage, {
      foreignKey: 'chatUserId',
      as: 'messages'
    });
  };

  ChatUser.afterDestroy(async (chatUser, options) => {
    chatUser.getMessages().then(messages => {
      messages.forEach(message => message.destroy());
    });
  });

  return ChatUser;
};
