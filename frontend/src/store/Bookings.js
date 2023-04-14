import { csrfFetch } from "./csrf";

export const createBooking = data => async () => {
    if (!data.addTo.length) return
    const response = await csrfFetch(`/api/spots/:spotId/bookings`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const payload = await response.json();
        return payload
    }
};

export const deleteBooking = bookingId => async () => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (response.ok) {
      return {
        'message': 'Booking deleted'
      }
    }
}

export const editBooking = (spotId, bookingId, data) => async () => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings/${bookingId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
        const payload = await response.json();
        return payload
    }
}

export const getBookings = (spotId) => async () => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    if (response.ok) {
      const payload = await response.json();
      return payload.Bookings
    }
}

export const getCurrentUserBookings = () => async () => {
    const response = await csrfFetch(`/api/bookings/current`);
    if (response.ok) {
      const payload = await response.json();
      return payload.Bookings
    }
}
