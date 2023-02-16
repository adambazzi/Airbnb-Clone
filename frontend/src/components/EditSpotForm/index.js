import { useEffect, useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpots } from '../../store/Spots';
import { createSpot } from '../../store/Spots';
import './index.css'

const SpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();

  const user = useSelector(state => state.session.user)
  const currentSpot = useSelector(state => state.spots.singleSpot)

  useEffect(() => {dispatch(getSingleSpot(spotId))}, [dispatch]);




  const [spotStateObject, setSpotStateObject] = useState({
    country: currentSpot ? currentSpot.country : '',
    streetAddress: currentSpot ? currentSpot.streetAddress : '',
    city: currentSpot ? currentSpot.city : '',
    state: currentSpot ? currentSpot.state : '',
    latitude: currentSpot ? currentSpot.latitude : '',
    longitude: currentSpot ? currentSpot.longitude : '',
    description: currentSpot ? currentSpot.description : '',
    name: currentSpot ? currentSpot.name : '',
    price: currentSpot ? currentSpot.price : '',
    previewImage: currentSpot.SpotImages[0].url ? currentSpot.SpotImages[0].url : '',
    image1: currentSpot.SpotImages[1].url ? currentSpot.SpotImages[1].url : '',
    image2: currentSpot.SpotImages[2].url ? currentSpot.SpotImages[2].url : '',
    image3: currentSpot.SpotImages[3].url ? currentSpot.SpotImages[3].url : '',
    image4: currentSpot.SpotImages[4].url ? currentSpot.SpotImages[4].url : ''
  })

  const updateCountry = (e) => setSpotStateObject.country(e.target.value);
  const updateStreetAddress = (e) => setSpotStateObject.address(e.target.value);
  const updateCity = (e) => setSpotStateObject.city(e.target.value);
  const updateState = (e) => setSpotStateObject.state(e.target.value);
  const updateLatitude = (e) => setSpotStateObject.latitude(e.target.value);
  const updateLongitude = (e) => setSpotStateObject.longitude(e.target.value);
  const updateDescription = (e) => setSpotStateObject.description(e.target.value);
  const updateName = (e) => setSpotStateObject.name(e.target.value);
  const updatePrice = (e) => setSpotStateObject.price(e.target.value);
  const updatePreviewImage = (e) => setSpotStateObject.previewImage(e.target.value);
  const updateImage1 = (e) => setSpotStateObject.image1(e.target.value);
  const updateImage2 = (e) => setSpotStateObject.image2(e.target.value);
  const updateImage3 = (e) => setSpotStateObject.image3(e.target.value);
  const updateImage4 = (e) => setSpotStateObject.image4(e.target.value);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        spot: {
            ownerId: user.id,
            address: spotStateObject.streetAddress,
            city: spotStateObject.city,
            state: spotStateObject.state,
            country: spotStateObject.country,
            lat: spotStateObject.latitude,
            lng: spotStateObject.longitude,
            name: spotStateObject.name,
            description: spotStateObject.description,
            price: spotStateObject.price,
        },
        images: {
            previewImage: {
                url: spotStateObject.previewImage,
                preview: true
            },
            image1: {
                url: spotStateObject.image1,
                preview: false
            },
            image2: {
                url: spotStateObject.image2,
                preview: false
            },
            image3: {
                url: spotStateObject.image3,
                preview: false
            },
            image4: {
                url: spotStateObject.image4,
                preview: false
            }
        }
    };

    let createdSpotId = await dispatch(editSpot(payload));

    if (createdSpotId) {
        history.push(`/spots/${createdSpotId}`);
    }
}

if(!currentSpot) return null;


  return (
    <section id='spot-form-section'>
        <div id='spot-form-container'>
            <h2>Create a new Spot</h2>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form className='spot-form' onSubmit={handleSubmit}>
                <div id='spot-form-area-1'>
                    {/* country */}
                    <label>
                        Country
                    <input
                        type="text"
                        value={country}
                        onChange={updateCountry}
                        required
                        placeholder="Country"
                    />
                    </label>
                    {/* Street address */}
                    <label>
                        Street Address
                    <input
                        type="text"
                        value={streetAddress}
                        onChange={updateStreetAddress}
                        required
                        placeholder="Address"
                    />
                    </label>
                </div>
                <div id='spot-form-area-2'>
                    {/* City */}
                    <label id='city'>
                        City
                    <input
                        type="text"
                        value={city}
                        onChange={updateCity}
                        required
                        placeholder="City"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* State */}
                    <label id='state'>
                        State
                    <input
                        type="text"
                        value={state}
                        onChange={updateState}
                        required
                        placeholder="State"
                    />
                    </label>
                </div>
                <div id='spot-form-area-3'>
                    {/* Latitude */}
                    <label id='Latitude'>
                        Latitude
                    <input
                        type="number"
                        value={latitude}
                        onChange={updateLatitude}
                        required
                        placeholder="Latitude"
                    />
                    </label>
                    <div class='comma'>,</div>
                    {/* Longitude */}
                    <label id='Longitude'>
                        Longitude
                    <input
                        type="number"
                        value={longitude}
                        onChange={updateLongitude}
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
                        type="text"
                        value={description}
                        onChange={updateDescription}
                        required
                        placeholder="Description"
                    >
                        Please write at least 30 characters
                    </textarea>
                </div>
                {/* name */}
                <div id='title'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        Name
                    <input
                        type="text"
                        value={name}
                        onChange={updateName}
                        required
                        placeholder="Name of your spot"
                    />
                    </label>
                </div>
                {/* price */}
                <div id='price'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label>
                        $
                    <input
                        type="text"
                        value={price}
                        onChange={updatePrice}
                        required
                        placeholder='Price per night (USD)'
                    />
                    </label>
                </div>
                {/* photos */}
                <div id='photos'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        type="text"
                        value={previewImage}
                        onChange={updatePreviewImage}
                        required
                        placeholder='Preview Image URL'
                    />
                    <input
                        type="text"
                        value={image1}
                        onChange={updateImage1}
                        required
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image2}
                        onChange={updateImage2}
                        required
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image3}
                        onChange={updateImage3}
                        required
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image4}
                        onChange={updateImage4}
                        required
                        placeholder='Image URL'
                    />
                </div>
                <div id='submit-container'>
                    <button type="submit" id='button'>Create Spot</button>
                </div>
            </form>
        </div>
    </section>
  )
};

export default SpotForm;
