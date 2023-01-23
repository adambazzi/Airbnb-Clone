'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //one to many with review images
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });

      //one to many with users
      Review.belongsTo(models.User, { foreignKey: 'userId' });

      //one to many with spots
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Spots'
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users'
      },
    },
    review: DataTypes.TEXT(500),
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
