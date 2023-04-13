const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require("sequelize");

//Verify authorization
const checkBookingAuthorization = async (req,res,next) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    const bookingJSON = booking.toJSON()
    if (bookingJSON.userId !== req.user.id) {
        const error = new Error("Forbidden");
        error.status = 403;
        return next(error);
    }
    next()
}

//Check if booking exists
const checkBooking = async (req,res,next) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    if(!booking) {
        const error = new Error("Booking couldn't be found");
        error.status = 404;
        return next(error)
    }
    next()
}

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    // Retrieve bookings for the current user
    const bookings = await Booking.findAll({
      where: {
        userId: req.user.id
      },
      attributes: ["id", "spotId", "startDate", "endDate", "createdAt", "updatedAt"]
    });

    // Retrieve spots and spot images for each booking
    const spotIds = bookings.map(booking => booking.spotId);
    const spots = await Spot.scope('omitTimes').findAll({
      where: {
        id: spotIds
      },
      attributes: ["id", "title", "description"],
      include: [{
        model: SpotImage,
        as: "Images",
        attributes: ["url"],
        limit: 1
      }]
    });

    // Map bookings to JSON format and attach spot data
    const bookingsJSON = bookings.map(booking => {
      const bookingJSON = booking.toJSON();
      const spot = spots.find(spot => spot.id === bookingJSON.spotId);
      if (spot) {
        const spotJSON = spot.toJSON();
        bookingJSON.Spot = spotJSON;
        bookingJSON.Spot.previewImage = spotJSON.Images[0]?.url || null;
      }
      return bookingJSON;
    });

    // Send response to client with bookings data
    res.status(200).json({ Bookings: bookingsJSON });
  });

//Edit a Booking
router.put('/:bookingId', requireAuth, checkBooking, checkBookingAuthorization, async (req, res, next) => {
    // Retrieve the booking to be updated by ID
    const booking = req.booking;
    const bookingJSON = booking.toJSON();

    // Extract start and end dates from the request body and convert them to timestamps
    const { startDate, endDate } = req.body;
    const requestedStartDate = new Date(startDate).getTime();
    const requestedEndDate = new Date(endDate).getTime();

    // Check if end date is on or before start date
    if (requestedStartDate >= requestedEndDate) {
      const error = new Error("Validation error");
      error.errors = { "endDate": "endDate cannot be on or before startDate" };
      error.status = 400;
      return next(error);
    }

    // Check if booking is in the past
    const currentDate = new Date().getTime();
    if (currentDate >= requestedEndDate || currentDate >= requestedStartDate) {
      const error = new Error("Past bookings can't be modified");
      error.status = 403;
      return next(error);
    }

    // Check for booking conflicts
    const bookings = await Booking.findAll({
      where: {
        spotId: bookingJSON.spotId,
        // Exclude the current booking from the search results
        id: {
          [Op.ne]: req.params.bookingId
        }
      }
    });

    const errors = {};
    // Check for conflicts with each existing booking
    for (let booking of bookings) {
      const bookingJSON = booking.toJSON();
      const bookingStartDate = bookingJSON.startDate.getTime();
      const bookingEndDate = bookingJSON.endDate.getTime();
      if (requestedStartDate >= bookingStartDate && requestedStartDate < bookingEndDate) {
        errors.startDate = "Start date conflicts with an existing booking";
      }
      if (requestedEndDate <= bookingEndDate && requestedEndDate > bookingStartDate) {
        errors.endDate = "End date conflicts with an existing booking";
      }
      if (requestedStartDate <= bookingStartDate && requestedEndDate >= bookingEndDate) {
        errors.startDate = "Start date conflicts with an existing booking";
        errors.endDate = "End date conflicts with an existing booking";
      }
    }

    // Return an error if there are booking conflicts
    if (Object.keys(errors).length) {
      const error = new Error("Sorry, this spot is already booked for the specified dates");
      error.status = 403;
      error.errors = errors;
      return next(error);
    }

    // Update and save the booking
    booking.set({ startDate: new Date(startDate), endDate: new Date(endDate) });
    await booking.save();

    // Retrieve and send the updated booking data
    const updatedBooking = await Booking.findByPk(bookingJSON.id);
    res.status(200).json(updatedBooking);
  });


//Delete a Booking
router.delete("/:bookingId", requireAuth, checkBooking, checkBookingAuthorization, async(req,res,next) => {
    // Retrieve the booking by ID
    const booking = req.booking;

    // Check if the booking has started
    const { startDate, endDate } = booking;
    const currentDate = new Date().getTime();
    if (currentDate <= endDate || currentDate >= startDate) {
        const error = new Error("Bookings that have been started can't be deleted");
        error.status = 403;
        return next(error);
    }

    // Delete the booking
    await booking.destroy();

    // Send a success message
    res.status(200).json("Successfully deleted");
})


module.exports = router;
