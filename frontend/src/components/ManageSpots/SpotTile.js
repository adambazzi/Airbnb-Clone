
import { Link } from 'react-router-dom'
import DeleteSpotModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton';
import './SpotTile.css'


const SpotTile = ({ spot }) => {

    const price = Number.parseFloat(spot.price).toFixed(2)
    let avgRating = Number.parseFloat(spot.avgRating).toFixed(1);
    if (!(avgRating > 0)) avgRating = 'New'
    return (
        <div className='manage-spot-tile'>
            <Link to={`${spot.id}`} className='manage-spot-tile-link1'>
                <img className='manage-spot-tile-image' src={spot.previewImage} alt={spot.name}></img>
                <div className='manage-spot-tile-preview-information'>
                    <div className='manage-spot-tile-city-state-stars'>
                        <div className='manage-spot-tile-city-state'>{spot.name}</div>
                        <div className="manage-spot-tile-stars"><i className="fa-regular fa-star"></i>{avgRating}</div>
                    </div>
                </div>
            </Link>
            <div className='manage-spot-tile-update-delete'>
                <div className="manage-spot-tile-price">${price} night</div>
                <div className='manage-spot-tile-update-delete2'>
                    <Link to={`${spot.id}/edit`} className='manage-spot-tile-update'>Update</Link>
                    <OpenModalButton
                        className='manage-spot-tile-delete'
                        buttonText="Delete"
                        modalComponent={<DeleteSpotModal spotId={spot.id} />}
                    />
                </div>
            </div>

        </div>
    )
}

export default SpotTile
