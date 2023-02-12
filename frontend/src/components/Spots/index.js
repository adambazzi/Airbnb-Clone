import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpots } from '../../store/Spots'
import SpotTile from './SpotTile'

const Spots = () => {
  const dispatch = useDispatch();

  const spots = useSelector(state => state.spots.allSpots);

  useEffect(() => {dispatch(getSpots())}, [dispatch]);

  if (!spots) {
    return null;
  }

  return (
    <>
        <h1>Connected</h1>
        <div>
          {Object.values(spots).map(spot => <SpotTile spot={spot} />)}
        </div>
    </>
  )
};

export default Spots;
