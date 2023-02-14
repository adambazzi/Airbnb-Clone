import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSingleSpot } from '../../store/Spots'
import { useParams } from 'react-router-dom';
import SpotImages from './SpotImages';
import './index.css'
import DisplayReviews from './DisplayReviews';

const SingleSpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const spot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {dispatch(getSingleSpot(spotId))}, [dispatch]);

  if (!spot || !spot.Owner) return null;

  const avgRating2 = (Math.round(spot.avgRating * 10) / 10).toString()
  const avgRating3 = avgRating2.split('.').length === 1 ? avgRating2 + '.0' : avgRating2;

  const price1 = (Math.round(spot.price * 100) / 100).toString()
  let price2 = price1.split('.').length === 1 ? price1 + '.00' : price1;

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
              <span id="reserve-container-price">${price2}</span><span id="reserve-container-child1-night"> night</span>
            </div>
            <div>
              <i className="fa-regular fa-star"></i><span>{avgRating3}</span><span>{spot.numReviews}</span>
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
        <ul className='single-spot-display-reviews-list'>
          <DisplayReviews spotId={ spotId }/>
        </ul>
      </div>
    </section>
  )
};

export default SingleSpotShow;
