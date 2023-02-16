import React from "react";
import { useDispatch } from "react-redux";
import { deleteSpot, getCurrentUserSpots } from "../../store/Spots";
import { useModal } from "../../context/Modal";
// import './index.css'

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spotId))

    await dispatch(getCurrentUserSpots())
    closeModal()
  };

  return (
    <>
        <h1>Confirm Delete</h1>
        <div>Are you sure you want to remove this spot from the listings?</div>

        <button type="submit" value="delete" onClick={handleDelete}>Yes (Delete Spot)</button>
        <button type="submit" value='cancel' onClick={closeModal}>No (Keep Spot)</button>

    </>
  );
}

export default DeleteSpotModal;
