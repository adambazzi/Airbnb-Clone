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
router.post('/:spotId/bookings', requireAuth, checkSpot, async (req,res,next) => {
    //verify req.body is correct
    const { startDate, endDate } = req.body;

    const requestedStartDate = (new Date(startDate)).getTime()
    const requestedEndDate = (new Date(endDate)).getTime()
    if (requestedStartDate >= requestedEndDate) {
        const error = new Error("Validation error")
        error.errors = { "endDate": "endDate cannot be on or before startDate" }
        error.status = 400;
        return next(error)
    }

    //verify there isnt a booking conflict
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    const errors = {}
    for (let booking of bookings) {
        const bookingJSON = booking.toJSON();
        //booking records start and end dates are parsed below
        const bookingStartDate = bookingJSON.startDate.getTime()
        const bookingEndDate = bookingJSON.endDate.getTime()
        //verifying if there is a conflict with dates below
        if (requestedStartDate >= bookingStartDate && requestedStartDate < bookingEndDate) errors.startDate = "Start date conflicts with an existing booking";
        if (requestedEndDate <= bookingEndDate && requestedEndDate > bookingStartDate) errors.endDate = "End date conflicts with an existing booking";
        if(requestedStartDate < bookingStartDate && requestedEndDate > bookingEndDate){
            errors.endDate = "End date conflicts with an existing booking"
            errors.startDate = "Start date conflicts with an existing booking"
        }
    }
    //Sends errors if there is a booking conflict
    if (Object.keys(errors).length) {
        const error = new Error("Sorry, this spot is already booked for the specified dates");
        error.status = 403;
        error.errors = errors;
        return next(error)
    }

    //creates booking
    let newBooking = await Booking.build({
        ...req.body,
        spotId: req.params.spotId,
        userId: req.user.id
    })
    await newBooking.save()

    const verifyBooking = await Booking.findByPk(newBooking.toJSON().id)
    //sends the response body
    res.status(200).json(verifyBooking)

})

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, checkSpot, async (req,res,next) => {
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

    const newReview = await Review.build({
        spotId: req.params.spotId,
        userId: req.user.id,
        review: review,
        stars: stars
    });
    await newReview.save()
    const newReviewJSON = newReview.toJSON()

    const verifyReview = await Review.findByPk(newReviewJSON.id);
    res.status(201).json(verifyReview);
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, checkSpot, checkSpotAuthorization, async (req,res,next) => {
    const { url, preview } = req.body;

    const spotImages = await SpotImage.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    //Makes preview false for other images.
    if (preview === true) {
        for (let image of spotImages) {
            const imageJSON = image.toJSON()
            if (imageJSON.preview === true) {
                image.set({ preview: false })
                await image.save()
            }
        }
    }

    const newImage = {
        url: url,
        preview: preview,
        spotId: req.params.spotId
    };

    await SpotImage.create(newImage);
    const verifyImage = await SpotImage.findByPk(req.user.id, {
        attributes: ["id", "url", "preview"]
    });
    res.status(200).json(verifyImage);
})

//Create a Spot
router.post('/', requireAuth,  async (req,res,next) =>{
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
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
    }
    const errors = {}
    if (!spot.address) errors.address = "Street address is required";
    if (!spot.city) errors.city = "City is required";
    if (!spot.state) errors.state = "State is required";
    if (!spot.country) errors.country = "Country is required";
    if (!spot.lat) errors.lat = "Latitude is not valid";
    if (!spot.lng) errors.lng = "Longitude is not valid";
    if (!spot.name || spot.name.length >= 50) errors.name = "Name must be less than 50 characters";
    if (!spot.description) errors.description = "Description is required";
    if (!spot.price) errors.price = "Price per day is required";
    if (Object.keys(errors).length) {
        const error = new Error("Validation Error")
        error.status = 400
        error.errors = errors
        return next(error)
    }
    spot.ownerId = req.user.id;
    await Spot.create(spot)

    const verifySpot = await Spot.findOne({
        where: {
            address: spot.address
        }
    })

    res.status(201).json(verifySpot)
})

//Edit a spot
router.put('/:spotId', requireAuth, checkSpot, checkSpotAuthorization, async(req,res,next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId)

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

    if(Object.keys(errors).length) {
        const error = new Error("Validation Error")
        error.errors = errors
        error.status = 400;
        return next(error)
    }

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
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
    })
    const bookings2 = [];
    for (let booking of bookings) {
        let bookingJSON = booking.toJSON()
        if (booking.userId === req.user.id) {
            bookingJSON = {
                spotId: bookingJSON.spotId,
                startDate: bookingJSON.startDate,
                endDate: bookingJSON.endDate
            }

        } else {
            const user = await User.findByPk(bookingJSON.userId, {
                attributes: ["id", "firstName", "lastName"]
            });
            bookingJSON.User = user;
        }
        bookings2.push(bookingJSON)
    }

    res.status(200).json({ Bookings: bookings2 })
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', checkSpot, async (req,res,next) => {
    const spotId = req.params.spotId;

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    });

    const reviews2 = []
    for (let review of reviews) {
        const reviewJSON = review.toJSON();
        const user = await User.findByPk(reviewJSON.userId, {
            attributes: ["id", "firstName", "lastName"]
        })
        reviewJSON.User = user

        const reviewImages = await ReviewImage.findAll({
            where: {
                reviewId: reviewJSON.id
            },
            attributes: ["id", "url"]
        });
        reviewJSON.ReviewImages = reviewImages;
        reviews2.push(reviewJSON)
    }

    res.status(200).json({ Reviews: reviews2 })
})


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req,res,next) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id,
        },
    });

    const spotsV1 = [];

    for (let spot of spots) {
        let spotJSON= spot.toJSON();

        //average rating
        let reviews = await Review.findAll({
            where: {
                spotId: spotJSON.id,
            },
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        spotJSON.avgRating = reviews[0].toJSON().avgRating || 0;
        //preview image
        const image = await SpotImage.findOne({
            where: {
                spotId: spotJSON.id,
                preview: true
            },
        });
        spotJSON.previewImage = image.toJSON().url
        spotsV1.push(spotJSON);

    }


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

    //Number of reviews
    spotJSON.numReviews = await Review.count({
        where: {
            spotId: spotJSON.id
        }
    })

    //Average review rating
    let reviews = await Review.findAll({
        where: {
            spotId: spotJSON.id,
        },
        attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
    })
    reviews = reviews[0].toJSON();
    spotJSON.avgRating = reviews.avgRating || 0;

    //Owner information
    const owner = await User.findByPk(spotJSON.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    const ownerJSON = owner.toJSON();
    spotJSON.Owner = ownerJSON;

    res.status(200).json(spotJSON);
})

//Get all spots
router.get('/', async (req,res,next) => {
    const spots = await Spot.findAll();
    const spotsV1 = [];

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

    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    let pagination = {}

    if (page > 10) page = 10;
    if (size > 20) size = 20;

    const errors = {}
    if (page < 1) errors.page = "Page must be greater than or equal to 1";
    if (size < 1) errors.size = "Page must be greater than or equal to 1";
    if (Object.keys(errors).length) {
        const error = new Error("Validation Error");
        errors.status(400);
        error.errors = errors;
        return next(error);
    }

    pagination.limit = size
    pagination.offset = size * (page - 1)



    return res.status(200).json({
        Spots: spotsV1,
        ...pagination
    });
})

//Delete a spot
router.delete('/:spotId', requireAuth, checkSpot, checkSpotAuthorization, async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    await spot.destroy()
    res.status(200).json("Successfully deleted")
})

module.exports = router;
