import React from "react";
import { useDispatch } from "react-redux";
import { deleteReview, getSpotReviews } from "../../store/Reviews";
import { useModal } from "../../context/Modal";
// import './index.css'

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteReview(reviewId))

    await dispatch(getSpotReviews(spotId))
    closeModal()
  };

  return (
    <>
        <h1>Confirm Delete</h1>
        <div>Are you sure you want to delete this review?</div>

        <button type="submit" value="delete" onClick={handleDelete}>Yes (Delete Review)</button>
        <button type="submit" value='cancel' onClick={closeModal}>No (Keep Review)</button>

    </>
  );
}

export default DeleteReviewModal;
