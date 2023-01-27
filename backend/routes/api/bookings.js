const express = require('express')
const router = express.Router();
const Sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');

router.get('/current', requireAuth, async (req,res,next) => {
    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
    });

    const bookings1 = [];
    for (let booking of bookings) {
        const bookingJSON = booking.toJSON()
        const spot = await Spot.scope('omitTimes').findByPk(bookingJSON.spotId);
        spotJSON = spot.toJSON()
        const preview = await SpotImage.findOne({
            where: {
                spotId: spotJSON.id
            }
        })
        spotJSON.previewImage = preview.toJSON().url;
        bookingJSON.Spot = spotJSON;
        bookings1.push(bookingJSON);
    }

    res.status(200).json(bookings1);
})

router.put('/:bookingId', requireAuth, async (req,res,next) => {
    //verify if booking exists
    const booking = await Booking.findByPk(req.params.bookingId)
    if (!booking) {
        const error = new Error("Booking couldn't be found");
        error.status = 404;
        return next(error);
    }
    const bookingJSON = booking.toJSON()

    const { startDate, endDate } = req.body;

    const requestedStartDate = (new Date(startDate)).getTime();
    const requestedEndDate = (new Date(endDate)).getTime();
    //verify if startdate is before enddate in req body
    if (requestedStartDate > requestedEndDate) {
        const error = new Error("Validation error")
        error.errors = { "endDate": "endDate cannot be on or before startDate" }
        error.status = 400;
        return next(error)
    };

    //verify if booking is in the past, past bookings cant be modified
    if ((new Date()) > requestedEndDate) {
        const error = new Error("Past bookings can't be modified");
        error.status = 403;
        return next(error);
    };

    //verify there isnt a booking conflict
    const bookings = await Booking.findAll({
        where: {
            spotId: bookingJSON.spotId
        }
    })

    const errors = {}
    for (let booking of bookings) {
        const bookingJSON = booking.toJSON();
        //booking records start and end dates are parsed below
        const bookingStartDate = bookingJSON.startDate.getTime();
        const bookingEndDate = bookingJSON.endDate.getTime();
        //verifying if there is a conflict with dates below
        if (requestedStartDate >= bookingStartDate && requestedStartDate < bookingEndDate) errors.startDate = "Start date conflicts with an existing booking";
        if (requestedEndDate <= bookingEndDate && requestedEndDate > bookingStartDate) errors.endDate = "End date conflicts with an existing booking";
    }
    //Sends errors if there is a booking conflict
    if (Object.keys(errors).length) {
        const error = new Error("Sorry, this spot is already booked for the specified dates");
        error.status = 403;
        error.errors = errors;
        return next(error);
    }

    //edits and saves booking
    booking.set({
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    });
    await booking.save();

    //verifys booking is in the database
    const verifyBooking = await Booking.findByPk(bookingJSON.id)
    //sends the response body
    res.status(200).json(verifyBooking)
})

router.delete("/:bookingId", requireAuth, async(req,res,next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
        const error = new Error("Booking couldn't be found");
        error.status(404)
        return next(error)
    }

    const { startDate, endDate } = booking;
    const currentDate = (new Date()).getTime();
    if (currentDate < endDate && currentDate >= startDate) {
        const error = new Error("Bookings that have been started can't be deleted");
        error.status = 403;
        return next(error);
    }

    await booking.destroy();
    res.status(200).json("Successfully deleted")
})

module.exports = router;
