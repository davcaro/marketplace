/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const SocketConnection = sequelize.define(
    'SocketConnection',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      socketId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { paranoid: true }
  );

  SocketConnection.associate = function(models) {
    SocketConnection.belongsTo(models.User, {
      as: 'user'
    });
  };

  return SocketConnection;
};
