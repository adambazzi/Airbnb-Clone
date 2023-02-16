import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteSpot } from '../../store/Reviews';
import './DisplayReviews.css'

const DeleteSpot = ({ spotId }) => {
    const dispatch = useDispatch();

    useEffect(() => {dispatch(deleteSpot(spotId))}, [dispatch, spotId]);

}

export default DeleteSpot;
