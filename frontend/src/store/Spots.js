import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SPOT = 'spots/LOAD_SPOT'

const loadSpots = payload => ({
  type: LOAD_SPOTS,
  payload
});

const loadSpot = payload => ({
  type: LOAD_SPOT,
  payload
})

export const getSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpots(payload));
  }
};

const initialState = {
  allSpots: {},
  singleSpot: {}
};

export const getSingleSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if(response.ok) {
    const payload = await response.json()
    dispatch(loadSpot(payload))
  }
}

const spotsReducer = (state = initialState, action) => {
  let newState = { ...state }
  switch (action.type) {
    case LOAD_SPOTS:
      const allSpots = { ...action.payload.Spots };

      // action.payload.Spots.forEach(spot => {
      //   allSpots[spot.id] = spot;
      // });
      return {
        ...state,
        allSpots
      }
    case LOAD_SPOT:
      return {
        ...state,
        singleSpot: action.payload
      };
    default:
      return state;
  }
}

export default spotsReducer;
