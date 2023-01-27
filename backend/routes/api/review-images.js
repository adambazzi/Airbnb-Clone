const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');

router.delete('/:imageId', requireAuth, async (req,res,next) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    if (!reviewImage) {
        const error = new Error("Review Image couldn't be found");
        error.status(404);
        return next(error);
    };

    await reviewImage.destroy()

    res.status(200).json("Successfully deleted")
})

module.exports = router;
