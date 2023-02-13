import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpots } from '../../store/Spots';

const CreateSpotForm = ({ hideForm }) => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);
  const history = useHistory();

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
      country,
      streetAddress,
      city,
      state,
      latitude,
      longitude,
      description,
      name,
      price,
      previewImage,
      image1,
      image2,
      image3,
      image4
    };

    let createdSpot
    createdSpot = await dispatch(postSpot(payload));

    if (createdSpot) {
        history.push(`/spots/${createdSpot.id}`);
        hideForm();
      }
    }


  return (
    <section id='spot-form-section'>
        <h2>Create a new Spot</h2>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <form className='spot-form' onSubmit={handleSubmit}>
            {/* country */}
            <label>
                Country
            <input
                type="text"
                value={country}
                onChange={updateCountry}
                required
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
            />
            </label>
            {/* City */}
            <label>
                City
            <input
                type="text"
                value={city}
                onChange={updateCity}
                required
            />
            </label>
            {/* State */}
            <label>
                State
            <input
                type="text"
                value={state}
                onChange={updateState}
                required
            />
            </label>
            {/* Latitude */}
            <label>
                Latitude
            <input
                type="number"
                value={latitude}
                onChange={updateLatitude}
                required
            />
            </label>
            {/* Longitude */}
            <label>
                Longitude
            <input
                type="number"
                value={longitude}
                onChange={updateLongitude}
                required
            />
            </label>
            {/* Description */}
            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amentities like
                fast wifi or parking, and what you love about the neighborhood.</p>
            <textarea 
                type="text"
                value={description}
                onChange={updateDescription}
                required
            >
                Please write at least 30 characters
            </textarea>
            {/* name */}
            <h2>Create a title for your spot</h2>
            <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
            <label>
                Name
            <input
                type="text"
                value={name}
                onChange={updateName}
                required
            />
            </label>
            {/* price */}
            <h2>Set a base price for your spot</h2>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label>
                $
            <input
                type="text"
                value={price}
                onChange={updatePrice}
                required
            />
            </label>
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <input
                type="text"
                value={previewImage}
                onChange={updatePreviewImage}
                required
            />
            <input
                type="text"
                value={image1}
                onChange={updateImage1}
                required
            />
            <input
                type="text"
                value={image2}
                onChange={updateImage2}
                required
            />
            <input
                type="text"
                value={image3}
                onChange={updateImage3}
                required
            />
            <input
                type="text"
                value={image4}
                onChange={updateImage4}
                required
            />
            <button type="submit">Create new Spot</button>
        </form>

    </section>
  )
};

export default CreateSpotForm;
