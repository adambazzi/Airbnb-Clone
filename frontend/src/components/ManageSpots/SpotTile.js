
import { Link } from 'react-router-dom'
import DeleteSpotModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton';
import './SpotTile.css'


const SpotTile = ({ spot }) => {

    const price = Number.parseFloat(spot.price).toFixed(2)
    const avgRating = Number.parseFloat(spot.avgRating).toFixed(1)
    return (
        <div>
            <Link className='manage-spot-tile'  to={`${spot.id}`}>
                <img className='manage-spot-tile-image' src={spot.previewImage} alt={spot.name}></img>
                <div className='manage-spot-tile-preview-information'>
                    <div className='manage-spot-tile-city-state-stars'>
                        <div className='manage-spot-tile-city-state'>{spot.name}</div>
                        <div className="manage-spot-tile-stars"><i className="fa-regular fa-star"></i>{avgRating}</div>
                    </div>
                    <div className="manage-spot-tile-price">${price} night</div>
                </div>
            </Link>
            <Link to={`${spot.id}/edit`}>Update</Link>
            <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
            />

        </div>
    )
}

export default SpotTile
