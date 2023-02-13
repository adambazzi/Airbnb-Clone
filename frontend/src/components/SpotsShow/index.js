import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots } from '../../store/Spots'
import SpotTile from './SpotTile'
import './index.css'

const Spots = () => {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.allSpots);

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

export default Spots;
