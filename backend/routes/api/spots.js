const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const error = new Error("Spot couldn't be found")
        error.status = 404
        return next(error)
    }

    const { review, stars } = req.body;
    const errors = {};
    if (!review) errors.review = "Review text is required";
    if (!stars) errors.stars = "Stars must be an integer from 1 to 5";
    if (Object.keys(errors).length) {
        const error = new Error("Validation Error");
        error.status = 400;
        error.errors = errors;
        return next(error)
    }

    const newReview = await Review.build({
        userId: req.user.id,
        spotId: req.params.spotId,
        ...req.body,
    });
    await newReview.save()
    const newReviewJSON = newReview.toJSON()

    const verifyReview = await Review.findByPk(newReviewJSON.id);
    res.status(201).json(verifyReview);
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const error = new Error("Spot couldn't be found");
        error.status = 404;
        return next(error);
    }
    const { url, preview } = req.body;

    const image = {
        url: url,
        preview: preview,
        spotId: req.params.spotId
    };

    await SpotImage.create(image);
    const verifyImage = await SpotImage.findByPk(req.user.id);
    res.status(200).json(verifyImage);
})

//create a spot
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
router.put('/:spotId', requireAuth, async(req,res,next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const error = new Error("Spot couldn't be found")
        error.status = 404;
        return next(error)
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

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res,next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        const error = new Error("Spot couldn't be found");
        error.status = 404;
        return next(error)
    }

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

    res.status(200).json(reviews2)
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
        console.log(image)
        spotJSON.previewImage = image.toJSON().url
        spotsV1.push(spotJSON);

    }


    res.status(200).json(spotsV1);

})

//get details for a spot from an id
router.get('/:spotId', async (req,res,next) => {
    const spotId = req.params.spotId;
    let spot = await Spot.findByPk(spotId, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    })
    if (!spot) {
        error = new Error("Spot couldn't be found");
        error.status = 404;
        return next(error);
    }
    spotJSON = spot.toJSON()
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


    return res.status(200).json(spotsV1);
})

//delete a spot
router.delete('/:spotId', requireAuth, async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if(!spot) {
        const error = new Error("Spot couldn't be found")
        error.status = 404
        return next(error)
    }
    await spot.destroy()
    res.status(200).json("Successfully deleted")
})

module.exports = router;
