/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(650),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'for_sale'
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true,
      scopes: {
        full: {
          include: ['user', 'category', 'images']
        }
      }
    }
  );

  Article.associate = function(models) {
    Article.belongsTo(models.User.scope('public'), {
      as: 'user'
    });

    Article.belongsTo(models.Category, {
      as: 'category'
    });

    Article.hasMany(models.ArticleImage, { as: 'images' });
  };

  return Article;
};
