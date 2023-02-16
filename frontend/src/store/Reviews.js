import { csrfFetch } from "./csrf";
import { getSingleSpot } from "./Spots";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'

const loadReviews = payload => ({
    type: LOAD_REVIEWS,
    payload
  });

const addReview = payload => ({
  type: ADD_REVIEW,
  payload
});


export const getSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const payload = await response.json();
      dispatch(loadReviews(payload));
    }
  };

export const createReview = (data, spotId) => async dispatch => {
  const reviewResponse = await csrfFetch(`/api/spots/${data.spotId}/reviews`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });


  if (reviewResponse.ok) {
    const reviewPayload = await reviewResponse.json();
    dispatch(addReview(reviewPayload))
    dispatch(getSingleSpot(spotId))
  }
}

export const deleteReview = reviewId => async dispatch => {
  await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })

}

const initialState = {
    currentSpotReviews: {}
}

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS:
      const currentSpotReviews = {};
      action.payload.Reviews.forEach(review => {currentSpotReviews[review.id] = review})
      return {
        ...state,
        currentSpotReviews
      }
    case ADD_REVIEW:
        const currentSpotReviews2 = { ...state.currentSpotReviews }
        currentSpotReviews2[action.payload.id] = { ...action.payload }
        const newState = {
          ...state,
          currentSpotReviews: currentSpotReviews2
        };
        return newState;
    default:
      return state;
  }
}

export default reviewsReducer;
