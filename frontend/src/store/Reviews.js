import { csrfFetch } from "./csrf";
import { getSingleSpot } from "./Spots";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW'

const loadReviews = payload => ({
    type: LOAD_REVIEWS,
    payload
  });

const addReview = payload => ({
  type: ADD_REVIEW,
  payload
});

const removeReview = reviewId => ({
  type: REMOVE_REVIEW,
  reviewId
})

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
  }
}

export const deleteReview = reviewId => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    dispatch(removeReview(reviewId))
  }
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
        const currentSpotReviews2 = { ...state }
        currentSpotReviews2.currentSpotReviews[action.payload.id] = action.payload
        return currentSpotReviews2;
    case REMOVE_REVIEW:
      const currentSpotReviews3 = { ...state.currentSpotReviews }
      delete currentSpotReviews3[action.reviewId]
      return currentSpotReviews3

    default:
      return state;
  }
}

export default reviewsReducer;
