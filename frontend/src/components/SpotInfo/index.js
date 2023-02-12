import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots } from '../../store/Spots'
import SpotTile from './SpotInfo'
import './index.css'

const SpotInfo = () => {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.singleSpot);

  useEffect(() => {dispatch(getSpots())}, [dispatch]);

  if (!spots) {
    return null;
  }

  return (
    <section id='spot-gallery'>
      <div id='spot-tiles'>
        {Object.values(spots).map(spot => <SpotTile spot={spot} />)}
      </div>
    </section>
  )
};

export default SpotInfo;
