import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserSpots } from '../../store/Spots'
import SpotTile from './SpotTile'
import './index.css'

const ManageSpots = () => {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.currentUserSpots);

  useEffect(() => {dispatch(getCurrentUserSpots())}, [dispatch]);

  if (!Object.values(spots).length) {
    return null;
  }

  return (
    <section id='current-spots'>
      <div id='current-spot-tiles'>
        {Object.values(spots).map(spot => <SpotTile spot={spot} key={spot.id}/>)}
      </div>
    </section>
  )
};

export default ManageSpots;
