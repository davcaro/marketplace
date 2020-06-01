/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: false }
  );

  Category.associate = function(models) {
    Category.hasMany(models.Item, {
      foreignKey: 'categoryId',
      as: 'items'
    });
  };

  Category.afterDestroy(async (category, options) => {
    category.getItems().then(items => {
      items.forEach(item => item.destroy());
    });
  });

  return Category;
};
