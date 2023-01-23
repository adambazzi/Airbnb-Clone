'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //one to many relationship with reviews
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });

      //many to many relationship with users through bookings
      Spot.belongsToMany(models.User, {
        through: models.Booking,
          otherKey: 'userId',
          foreignKey: 'spotId'
      });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });

      //one to many relationship with user
      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});

      //one to many relationship with SpotImages
      Spot.hasMany(models.SpotImages, { foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users'
      },
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.TEXT(500),
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
