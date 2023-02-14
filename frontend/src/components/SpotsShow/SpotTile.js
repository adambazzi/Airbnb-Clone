
import { Link } from 'react-router-dom'
import './SpotTile.css'
const price1 = (Math.round(spot.price * 100) / 100).toString()
let price2 = price1.split('.').length === 1 ? price1 + '.00' : price1;


const SpotTile = ({ spot }) => {
    const price1 = (Math.round(spot.price * 100) / 100).toString()
    let price2 = price1.split('.').length === 1 ? price1 + '.00' : price1;
    return (
        <Link className='spot-tile' key={spot.id} to={`spots/${spot.id}`}>
            <img className='spot-tile-image' src={spot.previewImage} alt={spot.name}></img>
            <div className='spot-tile-preview-information'>
                <div className='spot-tile-city-state-stars'>
                    <div className='spot-tile-city-state'>{spot.city}, {spot.state}</div>
                    <div className="spot-tile-stars"><i className="fa-regular fa-star"></i>{price2}</div>
                </div>
                <div className="spot-tile-price">${price2} night</div>
            </div>
        </Link>
    )
}

export default SpotTile
