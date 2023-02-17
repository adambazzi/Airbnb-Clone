import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotReviews } from '../../store/Reviews';
import './DisplayReviews.css'
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal";

const DisplayReviews = ({ spotId }) => {
    const dispatch = useDispatch();

    const reviews = useSelector(state => state.reviews.currentSpotReviews);

    const user = useSelector(state => state.session.user);

    useEffect(() => {dispatch(getSpotReviews(spotId))}, [dispatch, spotId]);

    if (!Object.values(reviews).length || !user) return <li>Be the first to post a review!</li>;

    const reviewsArray = Object.values(reviews)

    const dateFormat = (date) => {
        const dateArray = date.split('-');
        return (dateArray[0] + '-' + dateArray[1] + '-' + dateArray[2].slice(0,2));
    }



    return (

        <>
            {reviewsArray.length > 0 && reviewsArray[0].User.firstName ? reviewsArray.map(review =>
                <li key={review.id}>
                    <h4>{review.User.firstName}</h4>
                    <div>{dateFormat(review.createdAt)}</div>
                    <div>{review.review}</div>
                    {user.id === review.userId ?
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
                    /> : <div></div>}
                </li>
            ) : (<li></li>)}
        </>

    )
}

export default DisplayReviews;
