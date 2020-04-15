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
    Category.hasMany(models.Article, {
      foreignKey: 'categoryId',
      as: 'articles'
    });
  };

  return Category;
};
