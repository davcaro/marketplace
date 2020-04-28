/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      latitude: {
        type: DataTypes.DECIMAL(16, 14),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(17, 14),
        allowNull: false
      },
      zoom: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      placeName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { paranoid: true }
  );

  Location.associate = function(models) {
    Location.hasOne(models.User, {
      foreignKey: 'locationId',
      as: 'user'
    });

    Location.hasOne(models.Item, {
      foreignKey: 'locationId',
      as: 'item'
    });
  };

  return Location;
};
