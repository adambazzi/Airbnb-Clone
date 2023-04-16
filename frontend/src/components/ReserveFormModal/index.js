import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getBookings, createBooking, getCurrentUserBookings, editBooking } from "../../store/Bookings";

import './index.css'

function ReserveFormModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [disableButton, setDisableButton] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [currentUserBookings, setCurrentUserBookings] = useState([]);
  const [verifyCurrentBookingExists, setVerifyCurrentBookingExists] = useState(null)

  useEffect(() => {
    // Fetch all bookings for this spot
    dispatch(getBookings(spotId))
      .then((response) => {
        // Store the bookings in state
        setBookings(response);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch current user's bookings for this spot
    dispatch(getCurrentUserBookings())
      .then((response) => {
        // Store the current user's bookings in state
        setCurrentUserBookings(response);

        // If the user has a reservation, set the default values of the date pickers
        if (response.length > 0) {
          let test = response.find(el => el.spotId === Number(spotId))
          if (test) setVerifyCurrentBookingExists(test)


          if (test) {
            setStartDate(new Date(test.startDate));
            setEndDate(new Date(test.endDate));

          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch, spotId]);

  useEffect(() => {
    if (startDate && endDate) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      startDate,
      endDate,
      spotId
    };


    if (verifyCurrentBookingExists) {
      dispatch(editBooking(verifyCurrentBookingExists.id, payload))
    } else {
      dispatch(createBooking(payload));
    }

    closeModal();
  };

  // Define a function to check if a given date range conflicts with an existing booking
  // const isBookingConflict = (start, end) => {

  //   if (!start) {
  //     return false;
  //   }

  //   for (let booking of bookings) {
  //     if (
  //       (start >= new Date(booking.startDate) && start <= new Date(booking.endDate)) ||
  //       (end >= new Date(booking.startDate) && end <= new Date(booking.endDate))
  //     ) {
  //       // Date range conflicts with an existing booking
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // Define a function to generate an array of dates between two given dates
  const getDatesInRange = (start, end) => {
    const dates = [];
    let date = new Date(start);
    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  // Define an array to store dates that should be excluded (i.e., already booked)
  let excludeDates = [];
  // Define an array to store dates that should be highlighted (i.e., already booked by the current user)
  let highlightDates = [];

  if (bookings.length > 0) {
    excludeDates = bookings.map((booking) =>
      getDatesInRange(new Date(booking.startDate), new Date(booking.endDate))
    ).flat();

    highlightDates = currentUserBookings.map((booking) =>
      getDatesInRange(new Date(booking.startDate), new Date(booking.endDate))
    ).flat();
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="reserve-form">
        <label htmlFor="start-date" className="reserve-label">Start Date:</label>
        <DatePicker
          id="start-date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          excludeDates={excludeDates}
          highlightDates={highlightDates}
          // filterDate={(date) => isBookingConflict(startDate, date)}
          dateFormat="dd/MM/yyyy"
          className="reserve-datepicker"
        />
        <label htmlFor="end-date" className="reserve-label">End Date:</label>
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          excludeDates={excludeDates}
          highlightDates={highlightDates}
          // filterDate={(date) => isBookingConflict(startDate, date)}
          dateFormat="dd/MM/yyyy"
          className="reserve-datepicker"
        />
        <button type="submit" disabled={disableButton} className="reserve-submit">Reserve!</button>
      </form>
    </>
  );
}
export default ReserveFormModal
