import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotReviews } from '../../store/Reviews';
import './DisplayReviews.css'

const DisplayReviews = ({ spotId }) => {
    const dispatch = useDispatch();

    const reviews = useSelector(state => state.reviews.currentSpotReviews);
    const user = useSelector(state => state.session.user)

    useEffect(() => {dispatch(getSpotReviews(spotId))}, [dispatch]);

    if (!reviews || !user) return null;


    const dateFormat = (date) => {
        const dateArray = date.split('-');
        console.log(dateArray)
        return (dateArray[0] + '-' + dateArray[1] + '-' + dateArray[2].slice(0,2));
    }

    return (

        <>
            {reviews.length ?
            reviews.map(review =>
                <li>
                    <h4>{user.username}</h4>
                    <div>{dateFormat(review.createdAt)}</div>
                    <div>{review.review}</div>
                </li>
            ) : (<li>Be the first to post a review!</li>)}
        </>

    )
}

export default DisplayReviews;
