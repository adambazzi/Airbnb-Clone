const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');

//Verify authorization
const checkSpotImageAuthorization = async (req,res,next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    const spotId = spotImage.toJSON().spotId;
    const spot = await Spot.findByPk(spotId);
    const spotJSON = spot.toJSON()
    if (spotJSON.ownerId !== req.user.id) {
        const error = new Error("Forbidden");
        error.status = 403;
        return next(error);
    }
    next()
}

//Check if spot image exists
const checkSpotImage = async (req,res,next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId)
    if(!spotImage) {
        const error = new Error("Spot Image couldn't be found");
        error.status = 404;
        return next(error)
    }
    next()
}

router.delete('/:imageId', requireAuth, checkSpotImage, checkSpotImageAuthorization, async (req,res,next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    await spotImage.destroy()

    res.status(200).json("Successfully deleted")
})

module.exports = router;
