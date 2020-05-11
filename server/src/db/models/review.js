/* eslint-disable no-unused-vars,func-names,no-param-reassign */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      score: {
        type: DataTypes.DECIMAL(2, 1)
      },
      description: {
        type: DataTypes.TEXT
      }
    },
    { paranoid: true }
  );

  Review.associate = function(models) {
    Review.belongsTo(models.Item, {
      as: 'item'
    });

    Review.belongsTo(models.User, {
      as: 'fromUser'
    });

    Review.belongsTo(models.User, {
      as: 'toUser'
    });
  };

  return Review;
};
