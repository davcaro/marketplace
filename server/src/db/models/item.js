/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    'Item',
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
          include: ['user', 'category', 'images', 'favorites', 'views']
        }
      }
    }
  );

  Item.associate = function(models) {
    Item.belongsTo(models.User.scope('public'), {
      as: 'user'
    });

    Item.belongsTo(models.Category, {
      as: 'category'
    });

    Item.hasMany(models.ItemImage, {
      foreignKey: 'itemId',
      as: 'images'
    });

    Item.hasMany(models.ItemFavorite, {
      foreignKey: 'itemId',
      as: 'favorites'
    });

    Item.hasMany(models.ItemView, {
      foreignKey: 'itemId',
      as: 'views'
    });
  };

  return Item;
};
