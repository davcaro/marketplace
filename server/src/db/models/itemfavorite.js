/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemFavorite = sequelize.define(
    'ItemFavorite',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['userId', 'itemId']
        }
      ]
    }
  );

  ItemFavorite.associate = function(models) {
    ItemFavorite.belongsTo(models.Item, {
      as: 'item'
    });
  };

  return ItemFavorite;
};
