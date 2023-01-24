'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1111 Example lane',
        city: 'City1',
        state: 'State1',
        country: 'United States',
        lat: -85.05112878,
        lng: 85.05112878,
        name: 'The lake house',
        description: 'Clean, Zen modern backyard cottage, easy access to SXSW, convention center, great dining, and public transportation. Gorgeous, peaceful space, close to the action but perfect for rest and recharging. Easy access to SXSW, ACL, F1 and all festivals.',
        price: 1000.56,
      }, {
        ownerId: 2,
        address: '2222 Example lane',
        city: 'City2',
        state: 'State2',
        country: 'United States',
        lat: -85.05112877,
        lng: 85.05112877,
        name: 'Earthouse Retreat',
        description: 'Enjoy living at its finest with an unforgettable stay at this modern underground 3-bed, 3-bath home! Earthouse offers unique architectural design providing guests with an open inviting interior complete with high-end furnishings, modern decor, and abundant natural light. Whether you\'re exploring Springfield, visiting local colleges, making your way to Branson for the day, or getting away, this luxurious, one-of-a-kind abode will be your ideal home base!',
        price: 950.20,
       }, {
        ownerId: 2,
        address: '3333 Example lane',
        city: 'City3',
        state: 'State3',
        country: 'United States',
        lat: -85.05112876,
        lng: 85.05112876,
        name: 'Earthouse Retreat',
        description: 'The Missile Base / Bunker property with it\'s underground Launch Control Center and a Utility Tunnel that leads to the 186 ft deep Missile Silo, with much of it\'s original floors still intact. Learn what it took to operate one of these amazing sites. The major construction/refurbishment areas, have been renovated into an unbelievable underground home and office. Prepare for one of the most awesome tours included with the cost of your stay.',
        price: 870.29,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
