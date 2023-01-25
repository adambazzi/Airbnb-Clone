const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');




//create an image for a spot
router.post('/:spotId/images', requireAuth, async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const error = new Error("Spot couldn't be found");
        error.status = 404;
        return next(error);
    }
    const { url, preview } = req.body;
    const errors = [];
    if (!url) errors.push("Url must be defined");
    if (preview === undefined) errors.push("Url must be defined");
    if (errors.length) {
        const error = new Error()
        error.errors = errors
        error.status = 400
        return next(error);
    }
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
    const errors = []
    if (!spot.address) errors.push("Street address is required");
    if (!spot.city) errors.push("City is required");
    if (!spot.state) errors.push("State is required");
    if (!spot.country) errors.push("Country is required");
    if (!spot.lat) errors.push("Latitude is not valid");
    if (!spot.lng) errors.push("Longitude is not valid");
    if (!spot.name) errors.push("Name must be less than 50 characters");
    if (!spot.description) errors.push("Description is required");
    if (!spot.price) errors.push("Price per day is required");
    if (errors.length) {
        const error = new Error(errors)
        error.status = 400
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

//edit a spot
router.put('/:spotId', requireAuth, async(req,res,next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const error = new Error("Spot couldn't be found")
        error.status = 404;
        return next(error)
    }

    const errors = []
    if (!address) errors.push("Street address is required");
    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");
    if (!country) errors.push("Country is required");
    if (!lat) errors.push("Latitude is not valid");
    if (!lng) errors.push("Longitude is not valid");
    if (!name) errors.push("Name must be less than 50 characters");
    if (!description) errors.push("Description is required");
    if (!price) errors.push("Price per day is required");

    if(errors.length) {
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

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req,res,next) => {
    const Spots = await Spot.findAll({
        where: {
            ownerId: req.user.id,
        },
    });
    res.status(200).json(Spots);

})

//get details for a spot from an id
router.get('/:spotId', async (req,res,next) => {
    const spotId = req.params.spotId;
    let spot = await Spot.findByPk(spotId, {
        include: {
            model: SpotImage,
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
