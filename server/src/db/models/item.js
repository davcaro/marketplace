/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import(`${__dirname}/user.js`);

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
      locationId: {
        type: DataTypes.INTEGER,
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
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email', 'avatar'],
              include: ['location'],
              as: 'user'
            },
            'category',
            'location',
            'images',
            'favorites',
            'views'
          ]
        }
      }
    }
  );

  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      as: 'user'
    });

    Item.belongsTo(models.Category, {
      as: 'category'
    });

    Item.belongsTo(models.Location, {
      as: 'location'
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

    Item.hasMany(models.Chat, {
      foreignKey: 'itemId',
      as: 'chats'
    });
  };

  return Item;
};
