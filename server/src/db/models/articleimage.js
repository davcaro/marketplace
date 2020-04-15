/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const ArticleImage = sequelize.define(
    'ArticleImage',
    {
      articleId: {
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

  ArticleImage.associate = function(models) {
    ArticleImage.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  };

  return ArticleImage;
};
