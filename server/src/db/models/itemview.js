/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemView = sequelize.define(
    'ItemView',
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
    {}
  );

  ItemView.associate = function(models) {
    ItemView.belongsTo(models.Item, {
      as: 'item'
    });
  };

  return ItemView;
};
