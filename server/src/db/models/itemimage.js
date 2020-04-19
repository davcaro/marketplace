/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemImage = sequelize.define(
    'ItemImage',
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { paranoid: true }
  );

  ItemImage.associate = function(models) {
    ItemImage.belongsTo(models.Item, {
      as: 'item'
    });
  };

  return ItemImage;
};
