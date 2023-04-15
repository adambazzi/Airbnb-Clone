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
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The beach house',
        description: 'Cozy, modern beachfront cottage, perfect for surfers and beach lovers. Enjoy the peaceful, breathtaking view from the large deck, or take a quick walk to local restaurants, shops and bars. Easy access to some of the best surf spots in the area.',
        price: 1500.50,
      },
      {
        ownerId: 3,
        address: '3333 Example avenue',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The mountain cabin',
        description: 'Rustic, spacious cabin nestled in the heart of the mountains. Perfect for a getaway, with beautiful views and access to some of the best hiking, fishing and outdoor activities. Enjoy the peace and quiet of nature, with modern amenities for comfort.',
        price: 2000.00,
      },
      {
        ownerId: 4,
        address: '4444 Example road',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The treehouse',
        description: 'Charming, one-of-a-kind treehouse in the heart of the forest. Perfect for a romantic escape, or a peaceful getaway with friends and family. Enjoy the tranquility of nature, with easy access to local attractions and activities.',
        price: 800.00,
      },
      {
        ownerId: 1,
        address: '5555 Example street',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The downtown loft',
        description: 'Stylish, modern loft in the heart of the city. Perfect for a city break, with easy access to some of the best shopping, dining, and nightlife in the area. Enjoy the energy of the city, with a comfortable and stylish space to return to.',
        price: 1300.00,
      },
      {
        ownerId: 2,
        address: '6666 Example lane',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The countryside retreat',
        description: 'Elegant, spacious retreat in the heart of the countryside. Perfect for a relaxing getaway, with beautiful views and easy access to local attractions and activities. Enjoy the peace and quiet of the countryside, with modern amenities for comfort.',
        price: 1700.00,
      },
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Charming Studio in the Mission',
        description: 'Cozy and comfortable studio apartment in the heart of the Mission district. Walking distance to some of the best restaurants, bars, and shops in the city. Perfect for a solo traveler or couple.',
        price: 120.50,
      },
      {
        ownerId: 2,
        address: '456 Valencia St',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Modern Condo in SOMA',
        description: 'Stylish and spacious one-bedroom condo in the heart of SOMA. Perfect for business travelers or couples. Close to public transportation and some of the best restaurants and nightlife in the city.',
        price: 250.00,
      },
      {
        ownerId: 3,
        address: '789 Market St',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Luxury Apartment in the Financial District',
        description: 'Spacious and elegant two-bedroom apartment in the heart of the Financial District. Perfect for families or groups of friends. Close to public transportation and some of the best shopping and dining in the city.',
        price: 450.00,
      },
      {
        ownerId: 4,
        address: '101 California St',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Penthouse Suite with Bay Views',
        description: 'Stunning penthouse suite with breathtaking views of the bay. Perfect for a romantic getaway or special occasion. Close to some of the best dining, shopping, and nightlife in the city.',
        price: 1000.00,
      },
      {
        ownerId: 1,
        address: '234 Lombard St',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Quaint Cottage in North Beach',
        description: 'Charming and cozy one-bedroom cottage in the heart of North Beach. Perfect for a romantic getaway or solo traveler. Walking distance to some of the best restaurants and nightlife in the city.',
        price: 150.00,
      },
      {
        ownerId: 2,
        address: '567 Pacific Ave',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Historic Loft in Jackson Square',
        description: 'Stylish and spacious loft apartment in the historic Jackson Square neighborhood. Perfect for a solo traveler or couple. Close to some of the best galleries, shops, and restaurants in the city.',
        price: 200.00,
      },
      {
      ownerId: 2,
      address: '1550 Hyde St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.7957,
      lng: -122.4202,
      name: 'Luxury Condo with City Views',
      description: 'Stylish and modern condo with breathtaking city views. Enjoy the amenities of a luxury building, including a rooftop pool, fitness center, and 24-hour concierge. Perfect for a city break with a touch of luxury.',
      price: 2000.00,
      },
      {
      ownerId: 3,
      address: '1365 Chestnut St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.8022,
      lng: -122.4222,
      name: 'Charming Marina District Apartment',
      description: 'Bright and cheerful apartment in the heart of the Marina District. Enjoy the convenience of this popular neighborhood, with easy access to shopping, dining, and nightlife. Perfect for a solo traveler or couple.',
      price: 1500.00,
      },
      {
      ownerId: 4,
      address: '1811 Sacramento St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.7917,
      lng: -122.4217,
      name: 'Classic Victorian Home in Pacific Heights',
      description: "Experience the charm and elegance of San Francisco in this beautifully restored Victorian home. Located in the desirable Pacific Heights neighborhood, with easy access to shopping, dining, and the city's top attractions.",
      price: 2500.00,
      },
      {
      ownerId: 1,
      address: '845 Market St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.7849,
      lng: -122.4064,
      name: 'Luxury Penthouse in the Heart of Union Square',
      description: 'Experience the ultimate in luxury living in this stunning penthouse apartment in the heart of Union Square. With panoramic views of the city, a private terrace, and access to a rooftop pool and fitness center, this is the perfect retreat for a sophisticated traveler.',
      price: 3000.00,
      },
      {
      ownerId: 2,
      address: '240 Lombard St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.8012,
      lng: -122.4087,
      name: 'Sleek and Modern SoMa Loft',
      description: "Step into this sleek and modern loft in San Francisco's trendy SoMa neighborhood. With high ceilings, industrial accents, and plenty of natural light, this space is perfect for a creative professional or a couple looking for a stylish urban retreat.",
      price: 1800.00,
      },
      {
      ownerId: 3,
      address: '2595 Lombard St',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      lat: 37.7998,
      lng: -122.4382,
      name: 'Cozy Cottage in the Marina',
      description: "Escape to this cozy and charming cottage in San Francisco's Marina district. With a private garden, fireplace, and plenty of amenities, this is the perfect spot for a romantic weekend or a solo retreat.",
      price: 1200.00,
      },
      {
        ownerId: 1,
        address: '5555 Example street',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.791501,
        lng: -122.398809,
        name: 'Stylish SoMa Condo',
        description: 'Modern, stylish condo in the heart of South of Market (SoMa) district. Perfect for business travelers or vacationers, with easy access to tech companies, restaurants, and nightlife. Enjoy the comfort and convenience of a fully furnished, modern space.',
        price: 2200.00,
        },
        {
        ownerId: 2,
        address: '2222 Example street',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.795023,
        lng: -122.399018,
        name: 'Spacious North Beach Apartment',
        description: "Bright, spacious apartment in the heart of North Beach, San Francisco's vibrant Italian neighborhood. Perfect for families or groups, with easy access to popular restaurants, cafes, and shops. Enjoy the charm and character of San Francisco in a comfortable and modern space.",
        price: 1700.00,
        },
        {
        ownerId: 3,
        address: '3333 Example avenue',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 37.780660,
        lng: -122.419487,
        name: 'Charming Hayes Valley Studio',
        description: "Cozy, charming studio in the heart of Hayes Valley, one of San Francisco's most vibrant neighborhoods. Perfect for solo travelers or couples, with easy access to local restaurants, cafes, and shops. Enjoy the comfort and convenience of a fully furnished, modern space.",
        price: 1000.00,
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
