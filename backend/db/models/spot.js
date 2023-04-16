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
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: "CASCADE", hooks: true  });

      //many to many relationship with users through bookings
      Spot.belongsToMany(models.User, {
        through: models.Booking,
          otherKey: 'userId',
          foreignKey: 'spotId'
      });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: "CASCADE", hooks: true  });

      //one to many relationship with user
      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});

      //one to many relationship with SpotImages
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users'
      },
      onDelete: 'CASCADE'
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(13,8),
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL(13,8),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1,50],
      },
    },
    description: {
      type: DataTypes.TEXT(500),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Spot',
    scopes: {
      omitTimes: {
        attributes: { exclude: ["createdAt", "updatedAt"] }
      },
    }
  });
  return Spot;
};
