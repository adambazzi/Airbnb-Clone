import { useSelector } from "react-redux";
import './DisplayReviews.css'
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal";

const DisplayReviews = ({ spotId, reviews }) => {

    const user = useSelector(state => state.session.user);

    if (!Object.values(reviews).length || !user) return <li>Be the first to post a review!</li>;

    const reviewsArray = Object.values(reviews)

    const dateFormat = (date) => {
        const dateArray = date.split('-');
        return (dateArray[0] + '-' + dateArray[1] + '-' + dateArray[2].slice(0,2));
    }



    return (

        <>
            {reviewsArray.length > 0 && reviewsArray[0].User.firstName ? reviewsArray.map(review =>
                <li key={review.id} className='spot-review'>
                    <h4>{review.User.firstName}</h4>
                    <div className="spot-review-date">{dateFormat(review.createdAt)}</div>
                    <div className="spot-review-review">{review.review}</div>
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
