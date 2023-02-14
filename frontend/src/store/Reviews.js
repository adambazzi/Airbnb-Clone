import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'

const loadReviews = payload => ({
    type: LOAD_REVIEWS,
    payload
  });

export const getSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadReviews(payload));
    }
  };


const initialState = {
    currentSpotReviews: []
}

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS:
        const currentSpotReviews = [ ...action.payload.Reviews ];
        return {
          ...state,
          currentSpotReviews
        }
    default:
      return state;
  }
}

export default reviewsReducer;
