const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot, SpotImage } = require('../../db/models');

//Verify authorization
const checkReviewAuthorization = async (req,res,next) => {
    const review = await Review.findByPk(req.params.reviewId)
    const reviewJSON = review.toJSON()
    if (reviewJSON.userId !== req.user.id) {
        const error = new Error("Forbidden");
        error.status = 403;
        return next(error);
    }
    next()
}

//Check if review exists
const checkReview = async (req,res,next) => {
    const review = await Review.findByPk(req.params.reviewId)
    if(!review) {
        const error = new Error("Review couldn't be found");
        error.status = 404;
        return next(error)
    }
    next()
}

//Edit a Review
router.put('/:reviewId', requireAuth, checkReview, checkReviewAuthorization, async (req, res, next) => {
    // Retrieve the review data from the request body
    const { review, stars } = req.body;

    // Validate the review and stars input
    const errors = {};
    if (!review) errors.review = "Review text is required";
    if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";
    if (Object.keys(errors).length) {
      const error = new Error("Validation error");
      error.status = 400;
      error.errors = errors;
      return next(error);
    }

    // Retrieve the review by ID
    const spotReview = req.review;

    // Update the review with the new data and save it
    const newReview = await spotReview.update({
      review: review,
      stars: stars
    });

    // Retrieve the updated review by ID
    const verifyReview = await Review.findByPk(newReview.id);

    // Send the updated review data to the client
    res.status(200).json(verifyReview);
  });


//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, checkReview, checkReviewAuthorization, async (req, res, next) => {
    // Retrieve the review ID from the request parameters
    const reviewId = req.params.reviewId;

    // Retrieve the review by ID
    const review = req.review;

    // Verify the number of images for the review
    const numberOfImages = await ReviewImage.count({
      where: {
        reviewId: review.id
      }
    });
    if (numberOfImages >= 10) {
      const error = new Error("Maximum number of images for this resource was reached");
      error.status = 403;
      return next(error);
    }

    // Create a new review image object and save it to the database
    const image = await ReviewImage.create({
      reviewId: review.id,
      ...req.body
    });

    // Retrieve the created review image by ID
    const verifyImage = await ReviewImage.findByPk(image.id);

    // Send the created review image data to the client
    res.status(200).json(verifyImage);
  });



//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    // Retrieve all reviews for the current user
    const reviews = await Review.findAll({
      where: {
        userId: req.user.id
      }
    });

    // Retrieve the current user by ID, and remove sensitive attributes
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName"]
    });
    const userJSON = user.toJSON();

    const reviews2 = [];
    for (let review of reviews) {
      const reviewJSON = review.toJSON();

      // Add the current user data to the review object
      reviewJSON.User = userJSON;

      // Retrieve the spot associated with the review, and remove sensitive attributes
      const spot = await Spot.scope('omitTimes').findByPk(reviewJSON.spotId);
      const previewImage = await SpotImage.findOne({
        where: {
          spotId: spot.toJSON().id,
          preview: true
        }
      });

      // Add the spot data to the review object, including the URL of the preview image
      const spotJSON = spot.toJSON();
      spotJSON.previewImage = previewImage.toJSON().url;
      reviewJSON.Spot = spotJSON;

      // Retrieve all review images associated with the review
      const images = await ReviewImage.findAll({
        where: {
          reviewId: reviewJSON.id
        },
        attributes: ["id", "url"]
      });
      reviewJSON.ReviewImages = images;

      reviews2.push(reviewJSON);
    }

    // Send the reviews data to the client
    res.status(200).json({ Reviews: reviews2 });
  });


//Delete a Review
router.delete('/:reviewId', requireAuth, checkReview, checkReviewAuthorization, async (req, res, next) => {
    // Find the review by ID
    const spotReview = await Review.findByPk(req.params.reviewId);

    // Delete the review from the database
    await spotReview.destroy();

    // Send a success response to the client
    res.status(200).json("Successfully deleted");
  });




module.exports = router;
