
const LOAD_SPOTS = 'spots/LOAD_SPOTS'

const loadSpots = payload => ({
  type: LOAD_SPOTS,
  payload
});

export const getSpots = () => async dispatch => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpots(payload));
  }
};

const initialState = {
  allSpots: {},
  singleSpot: {}
};

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
    default:
      return state;
  }
}

export default spotsReducer;
