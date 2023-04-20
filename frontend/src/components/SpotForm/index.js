import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot } from '../../store/Spots';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import './index.css'

const SpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(state => state.session.user)

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
        previewImage: '',
        image1: '',
        image2: '',
        image3: '',
        image4: ''
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

    const handleChange = e => {
        const changeSpot = {...spotStateObject, [e.target.name]: e.target.value}
        setSpotStateObject(changeSpot)
    }




    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append spot properties individually
        const spot = {
            ownerId: user.id,
            country: spotStateObject.country,
            address: spotStateObject.address,
            city: spotStateObject.city,
            state: spotStateObject.state,
            lat: spotStateObject.lat,
            lng: spotStateObject.lng,
            description: spotStateObject.description,
            name: spotStateObject.name,
            price: spotStateObject.price
        }

        const images = [
            { preview: true, file: spotStateObject.previewImage },
            { preview: false, file: spotStateObject.image1 },
            { preview: false, file: spotStateObject.image2 },
            { preview: false, file: spotStateObject.image3 },
            { preview: false, file: spotStateObject.image4 },
          ];

    // Append the entire images array as a JSON string
    formData.append('images', JSON.stringify(images));

        //checks form
        const errors = {}
        if (!spot.country.length) errors.country = 'Country is required';
        if (!spot.state.length) errors.state = 'State is required';
        if (!spot.city.length) errors.city = 'City is required';
        if (!spot.address.length) errors.address = 'Address is required';
        if (!spot.lat.toString().length) errors.lat = 'Latitude is required';
        if (!spot.lng.toString().length) errors.lng = 'Longitude is required';
        if (spot.description.length < 30) errors.description = 'Description needs a minimum of 30 characters';
        if (!spot.name.length) errors.name = 'Name is required';
        if (!spot.price.toString().length) errors.price = 'Price is required';
        if (!JSON.parse(formData.get('images'))[0].file) errors.previewImage = 'Preview image is required';



        if (!Object.values(errors).length) {
            let createdSpotId = await dispatch(createSpot(spot, formData));

            if (createdSpotId) {
                history.push(`/spots/${createdSpotId}`);
            }

        } else {
            setValidationErrors(errors)
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
                        <div>Country <span className='validationErrors'>{validationErrors.address}</span></div>
                    <input
                        name='country'
                        type="text"
                        value={spotStateObject.country}
                        onChange={handleChange}
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
                        placeholder="Address"
                    />
                    </label>
                </div>
                <div id='spot-form-area-2'>
                    {/* City */}
                    <label id='city'>
                        <div>City <span className='validationErrors'>{validationErrors.city}</span></div>
                    <input
                        type="text"
                        name='city'
                        value={spotStateObject.city}
                        onChange={handleChange}
                        placeholder="City"
                    />
                    </label>
                    <div className='comma'></div>
                    {/* State */}
                    <label id='state'>
                        <div>State <span className='validationErrors'>{validationErrors.state}</span></div>
                    <input
                        type="text"
                        name='state'
                        value={spotStateObject.state}
                        onChange={handleChange}
                        placeholder="State"
                    />
                    </label>
                </div>
                <div id='spot-form-area-3'>
                    {/* Latitude */}
                    <label id='Latitude'>
                        <div>Latitude <span className='validationErrors'>{validationErrors.lat}</span></div>
                    <input
                        type="number"
                        name='lat'
                        value={spotStateObject.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                    />
                    </label>
                    <div className='comma'></div>
                    {/* Longitude */}
                    <label id='Longitude'>
                        <div>Longitude <span className='validationErrors'>{validationErrors.lng}</span></div>
                    <input
                        type="number"
                        name='lng'
                        value={spotStateObject.lng}
                        onChange={handleChange}
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
                        name='description'
                        value={spotStateObject.description}
                        onChange={handleChange}
                        placeholder="Description"
                    >
                        Please write at least 30 characters
                    </textarea>
                    <div className='validationErrors'>{validationErrors.description}</div>
                </div>
                {/* name */}
                <div id='title'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        <div>Name</div>
                        <input
                            type="text"
                            value={spotStateObject.name}
                            name='name'
                            onChange={handleChange}
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

                    <input
                        type="text"
                        name='price'
                        value={spotStateObject.price}
                        onChange={handleChange}
                        placeholder='Price per night (USD)'
                    />
                    </label>
                    <div className='validationErrors'>{validationErrors.price}</div>
                </div>
                {/* photos */}
                <div id='photos'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        type="file"
                        name='previewImage'
                        onChange={handleChange}
                    />
                    {validationErrors.previewImage ? (<div className='validationErrors'>{validationErrors.previewImage}</div>) : ''}
                    <input
                        type="file"
                        name='image1'
                        onChange={handleChange}
                    />
                    {validationErrors.imageType ? (<div className='validationErrors'>{validationErrors.imageType}</div>) : ''}
                    <input
                        type="file"
                        name='image2'
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name='image3'
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name='image4'
                        onChange={handleChange}
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
