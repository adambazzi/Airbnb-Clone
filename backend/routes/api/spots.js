const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

//Verify authorization
const checkSpotAuthorization = async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const spotJSON = spot.toJSON()
    if (spotJSON.ownerId !== req.user.id) {
        const error = new Error("Forbidden");
        error.status = 403;
        return next(error);
    }
    next()
}

//Check if spot exists
const checkSpot = async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if(!spot) {
        const error = new Error("Spot couldn't be found");
        error.status = 404;
        return next(error)
    }
    next()
}

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, checkSpot, async (req, res, next) => {
    // Verify that the request body contains the correct data
    const { startDate, endDate } = req.body;

    const requestedStartDate = (new Date(startDate)).getTime();
    const requestedEndDate = (new Date(endDate)).getTime();

    if (requestedStartDate >= requestedEndDate) {
      const error = new Error("Validation error");
      error.errors = { "endDate": "endDate cannot be on or before startDate" };
      error.status = 400;
      return next(error);
    }

    // Check if there are any booking conflicts for the specified spot
    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      }
    });

    const errors = {};
    for (let booking of bookings) {
      const bookingJSON = booking.toJSON();
      const bookingStartDate = bookingJSON.startDate.getTime();
      const bookingEndDate = bookingJSON.endDate.getTime();

      if (requestedStartDate >= bookingStartDate && requestedStartDate < bookingEndDate) errors.startDate = "Start date conflicts with an existing booking";
      if (requestedEndDate <= bookingEndDate && requestedEndDate > bookingStartDate) errors.endDate = "End date conflicts with an existing booking";
      if (requestedStartDate < bookingStartDate && requestedEndDate > bookingEndDate) {
        errors.endDate = "End date conflicts with an existing booking"
        errors.startDate = "Start date conflicts with an existing booking"
      }
    }

    // Send an error response if there are any booking conflicts
    if (Object.keys(errors).length) {
      const error = new Error("Sorry, this spot is already booked for the specified dates");
      error.status = 403;
      error.errors = errors;
      return next(error);
    }

    // Create a new booking and save it to the database
    const newBooking = await Booking.build({
      ...req.body,
      spotId: req.params.spotId,
      userId: req.user.id
    });

    await newBooking.save();

    // Retrieve the new booking from the database and send it as the response body
    const verifyBooking = await Booking.findByPk(newBooking.toJSON().id);

    res.status(200).json(verifyBooking);
  });


// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, checkSpot, async (req, res, next) => {
    // Check if the request body contains the correct data
    const { review, stars } = req.body;
    const errors = {};

    if (!review) errors.review = "Review text is required";
    if (!stars || !Number.isInteger(stars) || !(stars >= 1 && stars <= 5)) errors.stars = "Stars must be an integer from 1 to 5";
    if (Object.keys(errors).length) {
      const error = new Error("Validation Error");
      error.status = 400;
      error.errors = errors;
      return next(error);
    }

    // Create a new review and save it to the database
    const newReview = await Review.build({
      spotId: req.params.spotId,
      userId: req.user.id,
      review: review,
      stars: stars
    });

    await newReview.save();

    // Retrieve the new review from the database and send it as the response body
    const verifyReview = await Review.findByPk(newReview.toJSON().id);

    res.status(201).json(verifyReview);
  });


//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, checkSpot, checkSpotAuthorization, async (req,res,next) => {
    const { url, preview } = req.body;

    // Get all existing images for the specified spot
    const spotImages = await SpotImage.findAll({
        where: {
            spotId: req.params.spotId
        }
    });

    // If preview is true, set the preview attribute to false for all other images
    if (preview === true) {
        for (let image of spotImages) {
            const imageJSON = image.toJSON();
            if (imageJSON.preview === true) {
                image.set({ preview: false });
                await image.save();
            }
        }
    }

    // Create a new image and save it to the database
    const newImage = {
        url: url,
        preview: preview,
        spotId: req.params.spotId
    };

    await SpotImage.create(newImage);

    // Retrieve the newly created image and send it as the response body
    const verifyImage = await SpotImage.findOne({
        where: {
            spotId: req.params.spotId,
            url: url
        },
        attributes: ["id", "url", "preview"]
    });

    res.status(200).json(verifyImage);
});


//Create a Spot
router.post('/', requireAuth, async (req, res, next) => {
    // Extract fields from the request body
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Create a new spot object with the extracted fields
    const spot = {
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    };

    // Validate the input fields
    const errors = {};
    if (!spot.address) errors.address = "Street address is required";
    if (!spot.city) errors.city = "City is required";
    if (!spot.state) errors.state = "State is required";
    if (!spot.country) errors.country = "Country is required";
    if (!spot.lat) errors.lat = "Latitude is not valid";
    if (!spot.lng) errors.lng = "Longitude is not valid";
    if (!spot.name || spot.name.length >= 50) errors.name = "Name must be less than 50 characters";
    if (!spot.description) errors.description = "Description is required";
    if (!spot.price) errors.price = "Price per day is required";

    // Send an error response if there are validation errors
    if (Object.keys(errors).length) {
        const error = new Error("Validation Error");
        error.status = 400;
        error.errors = errors;
        return next(error);
    }

    // Set the ownerId field to the id of the authenticated user
    spot.ownerId = req.user.id;

    // Create a new spot with the validated fields
    await Spot.create(spot);

    // Retrieve the new spot from the database and send it as the response body
    const verifySpot = await Spot.findOne({
        where: {
            address: spot.address
        }
    });

    res.status(201).json(verifySpot);
});


//Edit a spot
router.put('/:spotId', requireAuth, checkSpot, checkSpotAuthorization, async(req,res,next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Find the spot by its ID
    const spot = await Spot.findByPk(req.params.spotId)

    // Check for validation errors
    const errors = {}
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat) errors.lat = "Latitude is not valid";
    if (!lng) errors.lng = "Longitude is not valid";
    if (!name || name.length >= 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    // Send a 400 error response if there are any validation errors
    if(Object.keys(errors).length) {
        const error = new Error("Validation Error")
        error.errors = errors
        error.status = 400;
        return next(error)
    }

    // Update the spot with the new information and save to the database
    spot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })

    await spot.save()

    // Retrieve the updated spot from the database and send it as the response body
    const verifySpot = await Spot.findByPk(req.params.spotId)
    if (!verifySpot) {
        const error = new Error("Validation Error")
        error.errors = errors
        error.status = 400
        return next(error)
    }

    res.status(200).json(verifySpot)
})


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, checkSpot, async (req,res,next) => {
    // Retrieve all bookings for the specified spot
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
    })

    const bookings2 = [];
    // Loop through the bookings and format the response body
    for (let booking of bookings) {
        let bookingJSON = booking.toJSON()

        // If the booking belongs to the authenticated user, only send the spotId, startDate, and endDate
        if (booking.userId === req.user.id) {
            bookingJSON = {
                spotId: bookingJSON.spotId,
                startDate: bookingJSON.startDate,
                endDate: bookingJSON.endDate
            }

        } else {
            // If the booking does not belong to the authenticated user, include the User object in the response
            const user = await User.findByPk(bookingJSON.userId, {
                attributes: ["id", "firstName", "lastName"]
            });
            bookingJSON.User = user;
        }
        bookings2.push(bookingJSON)
    }

    // Send the formatted response body
    res.status(200).json({ Bookings: bookings2 })
})


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', checkSpot, async (req, res, next) => {
    const spotId = req.params.spotId;

    // Retrieve all reviews for the specified spot
    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      }
    });

    const reviews2 = []
    for (let review of reviews) {
      const reviewJSON = review.toJSON();

      // Retrieve the user who wrote the review
      const user = await User.findByPk(reviewJSON.userId, {
        attributes: ["id", "firstName", "lastName"]
      })

      reviewJSON.User = user

      // Retrieve all images associated with the review
      const reviewImages = await ReviewImage.findAll({
        where: {
          reviewId: reviewJSON.id
        },
        attributes: ["id", "url"]
      });

      reviewJSON.ReviewImages = reviewImages;
      reviews2.push(reviewJSON)
    }

    // Send the reviews as the response body
    res.status(200).json({ Reviews: reviews2 })
  })



//Get all Spots owned by the Current User
// Route for retrieving all spots owned by the authenticated user
router.get('/current', requireAuth, async (req, res, next) => {
    // Find all spots owned by the authenticated user
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id,
        },
    });

    const spotsV1 = [];

    // Iterate over each spot to add average rating and preview image to the response
    for (let spot of spots) {
        let spotJSON= spot.toJSON();

        // Calculate the average rating for the spot based on its reviews
        let reviews = await Review.findAll({
            where: {
                spotId: spotJSON.id,
            },
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        })
        // Add the average rating to the spot object
        spotJSON.avgRating = reviews[0].toJSON().avgRating || 0;

        // Find the preview image for the spot and add its URL to the spot object
        const image = await SpotImage.findOne({
            where: {
                spotId: spotJSON.id,
                preview: true
            },
        });
        if (image) {
            spotJSON.previewImage = image.toJSON().url
        }

        // Add the updated spot object to the response array
        spotsV1.push(spotJSON);
    }

    // Send the updated spots array as the response
    res.status(200).json({ Spots: spotsV1 });
})


//Get details of a Spot from an id
router.get('/:spotId', checkSpot, async (req,res,next) => {
    const spotId = req.params.spotId;
    let spot = await Spot.findByPk(spotId, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    })
    spotJSON = spot.toJSON()

    //Calculate the number of reviews for the spot
    spotJSON.numReviews = await Review.count({
        where: {
            spotId: spotJSON.id
        }
    })

    //Calculate the average review rating for the spot
    let reviews = await Review.findAll({
        where: {
            spotId: spotJSON.id,
        },
        attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
    })
    reviews = reviews[0].toJSON();
    spotJSON.avgRating = reviews.avgRating || 0;

    //Retrieve the owner information and include it in the response
    const owner = await User.findByPk(spotJSON.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    const ownerJSON = owner.toJSON();
    spotJSON.Owner = ownerJSON;

    res.status(200).json(spotJSON);
})

// Get all spots with average rating and preview image and paginate the result
router.get('/', async (req,res,next) => {
    // Retrieve all spots
    const spots = await Spot.findAll();
    const spotsV1 = [];

    // Iterate over all spots and calculate average rating and add preview image if present
    for (let spot of spots) {
        let spotToJSON= spot.toJSON();
        let reviews = await Review.findAll({
            where: {
                spotId: spotToJSON.id,
            },
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        reviews = reviews[0].toJSON();
        spotToJSON.avgRating = reviews.avgRating || 0;

        let image = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true,
            }
        })
        if (image) {
            image = image.toJSON()
            spotToJSON.previewImage = image.url
        }
        spotsV1.push(spotToJSON);
    }

    // Pagination
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    let pagination = {}

    // Set maximum values for page and size
    if (page > 10) page = 10;
    if (size > 20) size = 20;

    const errors = {}

    // Validate page and size parameters
    if (page < 1) errors.page = "Page must be greater than or equal to 1";
    if (size < 1) errors.size = "Page must be greater than or equal to 1";
    if (Object.keys(errors).length) {
        const error = new Error("Validation Error");
        errors.status(400);
        error.errors = errors;
        return next(error);
    }

    // Set limit and offset for pagination
    pagination.limit = size
    pagination.offset = size * (page - 1)

    // Send response with paginated spots and pagination info
    return res.status(200).json({
        Spots: spotsV1,
        ...pagination
    });
})

// Delete a spot with the specified ID
router.delete('/:spotId', requireAuth, checkSpot, checkSpotAuthorization, async (req, res, next) => {
    // Find the spot by ID
    const spot = await Spot.findByPk(req.params.spotId)

    // Delete the spot from the database
    await spot.destroy()

    // Send a success response
    res.status(200).json("Successfully deleted")
})

module.exports = router;
