import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleSpot } from '../../store/Spots'
import { useParams } from 'react-router-dom';
import SpotImages from './SpotImages';
import './index.css'

const SingleSpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const spot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {dispatch(getSingleSpot(spotId))}, [dispatch]);

  if (!spot || !spot.Owner) return null;

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
              <span id="reserve-container-price">${spot.price.toFixed(2)}</span><span id="reserve-container-child1-night"> night</span>
            </div>
            <div>
              <i className="fa-regular fa-star"></i><span>{spot.avgRating.toFixed(1)}</span><span>{spot.numReviews.toFixed(0)}</span>
            </div>
          </div>
          <div className='reserve-button-container'>
            <button className="reserve-button" type="button">
                Reserve
            </button>
          </div>

        </div>
      </div>
      <div>
        <div><i className="fa-regular fa-star"></i> New</div>
        <div className='review-button-container'>
            <button className="review-button" type="button">
                Post Your Review
            </button>
        </div>
        <div>Be the first to post a review!</div>
      </div>
    </section>
  )
};

export default SingleSpotShow;
