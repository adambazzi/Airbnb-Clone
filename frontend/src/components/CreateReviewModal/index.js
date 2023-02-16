import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview, getSpotReviews } from "../../store/Reviews";
import { useModal } from "../../context/Modal";
import './index.css'


function CreateReviewModal() {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const user = useSelector(state => state.session.user)
  const spotId = useSelector(state => state.spots.singleSpot.id)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: user.id,
      spotId: spotId,
      review: review,
      stars: Number(stars)
    }

    await dispatch(createReview(payload, spotId));

    await dispatch(getSpotReviews(spotId));

    closeModal();

  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          <input
            type="textbox"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder='Just a quick review.'
            required
          />
        </label>
        <div class="rate">
          <input type="radio" id="star5" name="rate" value="5" onChange={(e) => setStars(e.target.value)} />
          <label for="star5" title="text"></label>
          <input type="radio" id="star4" name="rate" value="4" onChange={(e) => setStars(e.target.value)} />
          <label for="star4" title="text"></label>
          <input type="radio" id="star3" name="rate" value="3" onChange={(e) => setStars(e.target.value)} />
          <label for="star3" title="text"></label>
          <input type="radio" id="star2" name="rate" value="2" onChange={(e) => setStars(e.target.value)} />
          <label for="star2" title="text"></label>
          <input type="radio" id="star1" name="rate" value="1" onChange={(e) => setStars(e.target.value)} />
          <label for="star1" title="text"></label>
        </div>
        <button type="submit">Submit Your Review</button>
      </form>
    </>
  );
}

export default CreateReviewModal;
