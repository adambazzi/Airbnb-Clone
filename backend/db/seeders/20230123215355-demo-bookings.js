'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: new Date('December 17, 2023'),
        endDate: new Date('December 18, 2023'),
      }, {
        spotId: 2,
        userId: 1,
        startDate: new Date('December 17, 2023'),
        endDate: new Date('December 18, 2023'),
      }, {
        spotId: 3,
        userId: 2,
        startDate: new Date('December 17, 2023'),
        endDate: new Date('December 18, 2023'),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
