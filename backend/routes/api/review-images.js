const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');

//Verify authorization
const checkReviewImageAuthorization = async (req,res,next) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    const reviewId = reviewImage.toJSON().reviewId;
    const review = await Review.findByPk(reviewId);
    const reviewJSON = review.toJSON()
    if (reviewJSON.userId !== req.user.id) {
        const error = new Error("Forbidden");
        error.status = 403;
        return next(error);
    }
    next()
}

//Check if review image exists
const checkReviewImage = async (req,res,next) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId)
    if(!reviewImage) {
        const error = new Error("Review Image couldn't be found");
        error.status = 404;
        return next(error)
    }
    next()
}

//Delete a Review Image
router.delete('/:imageId', requireAuth, checkReviewImage, checkReviewImageAuthorization, async (req, res, next) => {
    // Retrieve the review image by ID
    const reviewImage = req.reviewImage;

    // Delete the review image from the database
    await reviewImage.destroy();

    // Send a success message to the client
    res.status(200).json("Successfully deleted");
  });


module.exports = router;
