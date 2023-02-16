
import { Link } from 'react-router-dom'
import './SpotTile.css'


const SpotTile = ({ spot }) => {

    const price = Number.parseFloat(spot.price).toFixed(2)
    const avgRating = Number.parseFloat(spot.avgRating).toFixed(1)
    return (
        <Link className='spot-tile' key={spot.id} to={`spots/${spot.id}`}>
            <img className='spot-tile-image' src={spot.previewImage} alt={spot.name}></img>
            <div className='spot-tile-preview-information'>
                <div className='spot-tile-city-state-stars'>
                    <div className='spot-tile-city-state'>{spot.city}, {spot.state}</div>
                    <div className="spot-tile-stars"><i className="fa-regular fa-star"></i>{avgRating}</div>
                </div>
                <div className="spot-tile-price">${price} night</div>
                <button>Delete</button>
            </div>
        </Link>
    )
}

export default SpotTile
