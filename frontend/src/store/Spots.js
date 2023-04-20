import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SPOT = 'spots/LOAD_SPOT'
const ADD_SPOT = 'spots/ADD_SPOT'
const LOAD_CURRENT_USER_SPOTS = 'spots/GET_CURRENT_USER_SPOTS'
const REMOVE_CURRENT_USER_SPOT = 'spots/REMOVE_CURRENT_USER_SPOT'
const REMOVE_SPOT = 'spots/CLEAR_SPOT'

// action creators
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

const loadCurrentUserSpots = payload => ({
  type: LOAD_CURRENT_USER_SPOTS,
  payload
})

const removeSpot = () => ({
  type: REMOVE_SPOT
})

const removeCurrentUserSpot = (payload) => ({
  type: REMOVE_CURRENT_USER_SPOT,
  payload
})


//thunk functions
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



export const createSpot = (spot, formData) => async dispatch => {
  // Save the spot data in the database
  const spotResponse = await csrfFetch(`/api/spots`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  let spotPayload;
  if (spotResponse.ok) {
    spotPayload = await spotResponse.json();
  }

  // Retrieve images array from formData
  const images = JSON.parse(formData.get("images"));

  // Use a new FormData object to send the image data
  const imagesFormData = new FormData();
  images
  .filter((image) => image.file)
  .forEach((image, index) => {
    imagesFormData.append(`image${index + 1}`, image.file);
    imagesFormData.append(`preview${index + 1}`, image.preview);
  });

  if (imagesFormData.getAll("image1").length) {
    const imagesResponse = await csrfFetch(`/api/spots/${spotPayload.id}/images`, {
      method: "post",
      body: imagesFormData, // Use the FormData object as the request body
    });

    if (!imagesResponse.ok) {
      throw new Error("Failed to save images.");
    }
  }

  return spotPayload.id;
};




export const getCurrentUserSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots/current');
  if (response.ok) {
    const payload = await response.json();
    dispatch(loadCurrentUserSpots(payload))
  }
}

export const deleteSpot = spotId => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    })
    dispatch(removeCurrentUserSpot(spotId));
}

export const editSpot = (data, spotId) => async dispatch => {
  const spotResponse = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data.spot)
  });

  let spotPayload
  if (spotResponse.ok) {
    spotPayload = await spotResponse.json()
    dispatch(addSpot(spotPayload));
  }
}

export const clearSpot = () => async dispatch => {
  dispatch(removeSpot())
}

const initialState = {
  allSpots: {},
  singleSpot: {},
  newSpotImages: {},
  currentUserSpots: {}
};


const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const allSpots = {};
      action.payload.Spots.forEach(spot => (allSpots[spot.id] = spot));
      return {
        ...state,
        allSpots
      }
    case LOAD_SPOT:
      return {
        ...state,
        singleSpot: { ...action.payload }
      };
    case ADD_SPOT:
      const allSpots2 = { ...state }
      allSpots2.allStates[action.payload.id] = action.payload
      return allSpots2
    case LOAD_CURRENT_USER_SPOTS:
      const currentUserSpots = { ...state.currentUserSpots };
      action.payload.Spots.forEach(spot => (currentUserSpots[spot.id] = spot));
      return {
        ...state,
        currentUserSpots
      }
    case REMOVE_CURRENT_USER_SPOT:
      const currentUserSpots2 = { ...state };
      delete currentUserSpots2.currentUserSpots[action.payload];
      return currentUserSpots2
    case REMOVE_SPOT:
      const clearSpot = {}
      return {
        ...state,
        singleSpot: clearSpot
      }
    default:
      return state;
  }
}

export default spotsReducer;
