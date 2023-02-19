import React from "react";
import { useDispatch } from "react-redux";
import { deleteSpot, getCurrentUserSpots } from "../../store/Spots";
import { useModal } from "../../context/Modal";
import './index.css'
import { useEffect } from "react";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // useEffect(() => {dispatch(getCurrentUserSpots())}, [handleDelete]);

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spotId))

    await dispatch(getCurrentUserSpots())
    closeModal()
  };

  return (
    <div className="delete-modal">
        <h1>Confirm Delete</h1>
        <div>Are you sure you want to remove this spot from the listings?</div>

        <button type="submit" value="delete" onClick={handleDelete} id='delete-spot'>Yes (Delete Spot)</button>
        <button type="submit" value='cancel' onClick={closeModal} id='cancel-delete-spot'>No (Keep Spot)</button>

    </div>
  );
}

export default DeleteSpotModal;
