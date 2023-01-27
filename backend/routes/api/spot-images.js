const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');

router.delete('/:imageId', requireAuth, async (req,res,next) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if (!spotImage) {
        const error = new Error("Spot Image couldn't be found");
        error.status(404);
        return next(error);
    };

    await spotImage.destroy()

    res.status(200).json("Successfully deleted")
})

module.exports = router;
