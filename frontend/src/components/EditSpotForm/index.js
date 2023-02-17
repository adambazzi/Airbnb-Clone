import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { editSpot } from '../../store/Spots';
import './index.css'
import { getSingleSpot } from '../../store/Spots';

const EditSpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { spotId } = useParams();

  const user = useSelector(state => state.session.user)
  const currentSpot = useSelector(state => state.spots.singleSpot)

  useEffect(() => {dispatch(getSingleSpot(spotId))}, [spotId, dispatch]);


  const [spotStateObject, setSpotStateObject] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
  })

  const [validationErrors, setValidationErrors] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    imageType: ''
})

  useEffect(()=> {
    const updatedSpot = {
        ...spotStateObject,
        address: currentSpot.address,
        city: currentSpot.city,
        state: currentSpot.state,
        country: currentSpot.country,
        lat: currentSpot.lat,
        lng: currentSpot.lng,
        name: currentSpot.name,
        description: currentSpot.description,
        price: Number(currentSpot.price)
    }
    setSpotStateObject(updatedSpot)
  }, [currentSpot.address, currentSpot.city, currentSpot.state, currentSpot.country, currentSpot.lat, currentSpot.lng, currentSpot.name, currentSpot.description, currentSpot.price])

  const handleChange = e => {
    const changeSpot = {...spotStateObject, [e.target.name]: e.target.value}
    setSpotStateObject(changeSpot)
  }


const handleSubmit = (e) => {
    e.preventDefault();


    const payload = {
        spot: {
            ownerId: user.id,
            address: spotStateObject.address,
            city: spotStateObject.city,
            state: spotStateObject.state,
            country: spotStateObject.country,
            lat: spotStateObject.lat,
            lng: spotStateObject.lng,
            name: spotStateObject.name,
            description: spotStateObject.description,
            price: spotStateObject.price,
        }
    };

    //checks form
    const errors = {}
    if (!payload.spot.country.length) errors.country = 'Country is required';
    if (!payload.spot.state.length) errors.state = 'State is required';
    if (!payload.spot.city.length) errors.city = 'City is required';
    if (!payload.spot.address.length) errors.address = 'Address is required';
    if (!payload.spot.lat.toString().length) errors.lat = 'Latitude is required';
    if (!payload.spot.lng.toString().length) errors.lng = 'Longitude is required';
    if (payload.spot.description.length < 30) errors.description = 'Description needs a minimum of 30 characters';
    if (!payload.spot.name.length) errors.name = 'Name is required';
    if (!payload.spot.price.toString().length) errors.price = 'Price is required';

    if (!Object.values(errors).length) {
        dispatch(editSpot(payload, spotId));


        history.push(`/spots/${spotId}`);

        setSpotStateObject({
            country: '',
            address: '',
            city: '',
            state: '',
            lat: '',
            lng: '',
            description: '',
            name: '',
            price: '',
        })
    } else {
        setValidationErrors(errors)
    }
}

if(!spotStateObject.name || !currentSpot.name) return null;


  return (
    <section id='spot-form-section'>
        <div id='spot-form-container'>
            <h2>Update your Spot</h2>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form className='spot-form' onSubmit={handleSubmit}>
                <div id='spot-form-area-1'>
                    {/* country */}
                    <label>
                        <div>Country <span className='validationErrors'>{validationErrors.address}</span></div>
                    <input
                        name='country'
                        type="text"
                        value={spotStateObject.country}
                        onChange={handleChange}
                        required
                        placeholder="Country"
                    />
                    </label>
                    {/* Street address */}
                    <label>
                        <div>Street Address <span className='validationErrors'>{validationErrors.country}</span></div>
                    <input
                        name='address'
                        type="text"
                        value={spotStateObject.address}
                        onChange={handleChange}
                        required
                        placeholder="Address"
                    />
                    </label>
                </div>
                <div id='spot-form-area-2'>
                    {/* City */}
                    <label id='city'>
                        <div>City <span className='validationErrors'>{validationErrors.city}</span></div>
                    <input
                        name='city'
                        type="text"
                        value={spotStateObject.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* State */}
                    <label id='state'>
                        <div>State <span className='validationErrors'>{validationErrors.state}</span></div>
                    <input
                        name='state'
                        type="text"
                        value={spotStateObject.state}
                        onChange={handleChange}
                        required
                        placeholder="State"
                    />
                    </label>
                </div>
                <div id='spot-form-area-3'>
                    {/* Latitude */}
                    <label id='Latitude'>
                        <div>Latitude <span className='validationErrors'>{validationErrors.lat}</span></div>
                    <input
                        name='lat'
                        type="number"
                        value={spotStateObject.lat}
                        onChange={handleChange}
                        required
                        placeholder="Latitude"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* Longitude */}
                    <label id='Longitude'>
                        <div>Longitude <span className='validationErrors'>{validationErrors.lng}</span></div>
                    <input
                        name='lng'
                        type="number"
                        value={spotStateObject.lng}
                        onChange={handleChange}
                        required
                        placeholder="Longitude"
                    />
                    </label>
                </div>
                {/* Description */}
                <div id='description'>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amentities like
                        fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea 
                        name='description'
                        type="text"
                        value={spotStateObject.description}
                        onChange={handleChange}
                        required
                        placeholder='Please write at least 30 characters'
                    >
                    </textarea>
                    <div className='validationErrors'>{validationErrors.description}</div>
                </div>
                {/* name */}
                <div id='title'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        Name
                    <input
                        name='name'
                        type="text"
                        value={spotStateObject.name}
                        onChange={handleChange}
                        required
                        placeholder="Name of your spot"
                    />
                    </label>
                    <div className='validationErrors'>{validationErrors.name}</div>
                </div>
                {/* price */}
                <div id='price'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label>
                        $
                    <input
                        name='price'
                        type="text"
                        value={spotStateObject.price}
                        onChange={handleChange}
                        required
                        placeholder='Price per night (USD)'
                    />
                    </label>
                    <div className='validationErrors'>{validationErrors.price}</div>
                </div>
                <div id='submit-container'>
                    <button type="submit" id='button'>Edit Spot</button>
                </div>
            </form>
        </div>
    </section>
  )
};

export default EditSpotForm;
