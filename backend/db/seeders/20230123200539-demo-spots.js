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
        ownerId: 2,
        address: '2222 Example street',
        city: 'City2',
        state: 'State2',
        country: 'United States',
        lat: -70.05112878,
        lng: 70.05112878,
        name: 'The beach house',
        description: 'Cozy, modern beachfront cottage, perfect for surfers and beach lovers. Enjoy the peaceful, breathtaking view from the large deck, or take a quick walk to local restaurants, shops and bars. Easy access to some of the best surf spots in the area.',
        price: 1500.50,
        },
        {
        ownerId: 3,
        address: '3333 Example avenue',
        city: 'City3',
        state: 'State3',
        country: 'United States',
        lat: -75.05112878,
        lng: 75.05112878,
        name: 'The mountain cabin',
        description: 'Rustic, spacious cabin nestled in the heart of the mountains. Perfect for a getaway, with beautiful views and access to some of the best hiking, fishing and outdoor activities. Enjoy the peace and quiet of nature, with modern amenities for comfort.',
        price: 2000.00,
        },
        {
        ownerId: 4,
        address: '4444 Example road',
        city: 'City4',
        state: 'State4',
        country: 'United States',
        lat: -80.05112878,
        lng: 80.05112878,
        name: 'The treehouse',
        description: 'Charming, one-of-a-kind treehouse in the heart of the forest. Perfect for a romantic escape, or a peaceful getaway with friends and family. Enjoy the tranquility of nature, with easy access to local attractions and activities.',
        price: 800.00,
        },
        {
        ownerId: 1,
        address: '5555 Example street',
        city: 'City5',
        state: 'State5',
        country: 'United States',
        lat: -65.05112878,
        lng: 65.05112878,
        name: 'The downtown loft',
        description: 'Stylish, modern loft in the heart of the city. Perfect for a city break, with easy access to some of the best shopping, dining, and nightlife in the area. Enjoy the energy of the city, with a comfortable and stylish space to return to.',
        price: 1300.00,
        },
        {
        ownerId: 2,
        address: '6666 Example lane',
        city: 'City6',
        state: 'State6',
        country: 'United States',
        lat: -60.05112878,
        lng: 60.05112878,
        name: 'The countryside retreat',
        description: 'Elegant, spacious retreat in the heart of the countryside. Perfect for a relaxing getaway, with beautiful views and easy access to local attractions and activities. Enjoy the peace and quiet of the countryside, with modern amenities for comfort.',
        price: 1700.00,
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
