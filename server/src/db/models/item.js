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

    Item.hasMany(models.Review, {
      foreignKey: 'itemId',
      as: 'reviews'
    });

    Item.hasMany(models.Notification, {
      foreignKey: 'itemId',
      as: 'notifications'
    });
  };

  Item.afterDestroy(async (item, options) => {
    item.getFavorites().then(favorites => {
      favorites.forEach(favorite => favorite.destroy());
    });

    item.getChats().then(chats => {
      chats.forEach(chat => chat.destroy());
    });

    item.getReviews().then(reviews => {
      reviews.forEach(review => review.destroy());
    });

    item.getNotifications().then(notifications => {
      notifications.forEach(notification => notification.destroy());
    });
  });

  return Item;
};
