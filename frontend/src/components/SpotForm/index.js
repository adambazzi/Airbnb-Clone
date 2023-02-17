import { useEffect, useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpots } from '../../store/Spots';
import { createSpot } from '../../store/Spots';
import './index.css'

const SpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(state => state.session.user)

  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
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
    image1: '',
    image2: '',
    image3: '',
    image4: '',
  })

  const updateCountry = (e) => setCountry(e.target.value);
  const updateStreetAddress = (e) => setStreetAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateLatitude = (e) => setLatitude(e.target.value);
  const updateLongitude = (e) => setLongitude(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePreviewImage = (e) => setPreviewImage(e.target.value);
  const updateImage1 = (e) => setImage1(e.target.value);
  const updateImage2 = (e) => setImage2(e.target.value);
  const updateImage3 = (e) => setImage3(e.target.value);
  const updateImage4 = (e) => setImage4(e.target.value);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        spot: {
            ownerId: user.id,
            address: streetAddress,
            city: city,
            state: state,
            country: country,
            lat: latitude,
            lng: longitude,
            name: name,
            description: description,
            price: price,
        },
        images: {
            previewImage: {
                url: previewImage,
                preview: true
            },
            image1: {
                url: image1,
                preview: false
            },
            image2: {
                url: image2,
                preview: false
            },
            image3: {
                url: image3,
                preview: false
            },
            image4: {
                url: image4,
                preview: false
            }
        }
    };

    let createdSpotId = await dispatch(createSpot(payload));

    if (createdSpotId) {
        history.push(`/spots/${createdSpotId}`);
    }
}


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
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image2}
                        onChange={updateImage2}
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image3}
                        onChange={updateImage3}
                        placeholder='Image URL'
                    />
                    <input
                        type="text"
                        value={image4}
                        onChange={updateImage4}
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
