import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SPOT = 'spots/LOAD_SPOT'
const ADD_SPOT = 'spots/ADD_SPOT'

const loadSpots = payload => ({
  type: LOAD_SPOTS,
  payload
});

const loadSpot = payload => ({
  type: LOAD_SPOT,
  payload
})
const addSpot = payload => ({
  type: ADD_SPOT,
  payload
})

export const getSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const payload = await response.json();
    dispatch(loadSpots(payload));
  }
};


export const getSingleSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if(response.ok) {
    const payload = await response.json()
    dispatch(loadSpot(payload))
  }
}

export const createSpot = data => async dispatch => {
  const spotResponse = await csrfFetch(`/api/spots`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data.spot)
  });

  let spotPayload
  if (spotResponse.ok) {
    spotPayload = await spotResponse.json()
  }
  console.log('spotPayload',spotPayload)
  for (let image of Object.values(data.images)) {
    console.log('image',image)
    image.spotId = spotPayload.id

    let imageResponse
    if (image.url !== '') {
      imageResponse = await csrfFetch(`/api/spots/${spotPayload.id}/images`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(image)
      })
    }
  }
  const newSpotResponse = await csrfFetch(`/api/spots/${spotPayload.id}`);

  if (newSpotResponse.ok) {
    const payload = await newSpotResponse.json();
    if (!payload.SpotImages) {
      dispatch(addSpot(payload));
    }
    return payload.id
  }


};

const initialState = {
  allSpots: {},
  singleSpot: {},
  newSpotImages: {}
};


const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const allSpots = { ...action.payload.Spots };
      return {
        ...state,
        allSpots
      }
    case LOAD_SPOT:
      return {
        ...state,
        singleSpot: action.payload
      };
    case ADD_SPOT:
      if (!state[action.payload.id]) {
        const newState = {
          ...state,
          [action.payload.id]: action.payload
        };
        const allSpots = newState.list.map(id => newState[id]);
        allSpots.push(action.payload);
        newState.allSpots = allSpots;
        return newState;
      }
      return {
        ...state.allSpots,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }
    default:
      return state;
  }
}

export default spotsReducer;
