import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleSpot } from '../../store/Spots'
import { getSpotReviews } from '../../store/Reviews';
import { useParams } from 'react-router-dom';
import SpotImages from './SpotImages';
import './index.css'
import DisplayReviews from './DisplayReviews';
import CreateReviewModal from '../CreateReviewModal';
import OpenModalButton from '../OpenModalButton';
import { clearSpot } from '../../store/Spots';
import ReserveFormModal from '../ReserveFormModal';
import { getCurrentUserBookings } from '../../store/Bookings';

const SingleSpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [reserveButtonText, setReserveButtonText] = useState('Reserve');
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => state.reviews.currentSpotReviews);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
    dispatch(getSpotReviews(spotId));
    dispatch(getCurrentUserBookings())
    .then((response) => {
      if (response.length > 0 && spotId) {
        let test = response.find(el => el.spotId === Number(spotId))
        if (test) {
          setReserveButtonText('Update Reservation')
        }
      }
    })

    return () => {
      dispatch(clearSpot());
    }
  }, [dispatch, spotId]);


  if (!spot || !spot.Owner || !reviews || !spot?.SpotImages?.length ) {
    return <div>Loading...</div>;
  }

  const reviewsArray = Object.values(reviews);
  let avgRating = (reviewsArray.reduce((acc, b) => acc + b.stars, 0)/reviewsArray.length).toFixed(1);
  if (!(avgRating > 0)) avgRating = 'New';
  const price = Number.parseFloat(spot.price).toFixed(2);
  let userHasPosted;
  if (user) userHasPosted = reviewsArray.find(el => el.userId == user.id);

  if (!Object.values(spot).length) {
    return null;
  }

  return (
    <section id='single-spot'>
      <div>{spot.name}</div>
      <div>{spot.city}, {spot.state}, {spot.country}</div>
      <SpotImages images={spot.SpotImages} />
      <div id='description-container'>
        <div id="name-description-container">
          <div id="hosted-by">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
          <div id="spot-description">{spot.description}</div>
        </div>
        <div id="reserve-container">
          <div id="reserve-container-child1">
            <div>
              <span id="reserve-container-price">${price}</span><span id="reserve-container-child1-night"> night</span>
            </div>
            <div>
              <i className="fa-regular fa-star"></i><span>{avgRating}</span>
            </div>
          </div>
          <div className='reserve-button-container'>
            {!user ?
              <button className="reserve-button" type="button" onClick={() => alert('Please sign in to make a reservation!')}>
                Reserve
              </button>
              :
              <OpenModalButton
                className="reserve-button"
                buttonText={reserveButtonText}
                modalComponent={<ReserveFormModal spotId={spotId} />}
              />
            }
          </div>

        </div>
      </div>
      <div>
        <div><i className="fa-regular fa-star"></i>{avgRating === 'New' ? avgRating : avgRating + ' · ' + reviewsArray.length + ' reviews'} </div>
        <div className='review-button-container'>
        {!userHasPosted && user ? (<OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<CreateReviewModal reviews={reviews} />}
        />) : ''}
        </div>
        <ul className='single-spot-display-reviews-list'>
          <DisplayReviews spotId={ spotId } reviews={reviews} />
        </ul>
      </div>
    </section>
  )
};

export default SingleSpotShow;
