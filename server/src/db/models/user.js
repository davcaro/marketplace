/* eslint-disable no-unused-vars,func-names */

'use strict';

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
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
