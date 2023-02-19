import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import './index.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  const {closeModal} = useModal();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeModal();
    history.push('/');
  };

  const ulClassName = "profile-dropdown dropdown-menu-display" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} id='profile-button'>
        <i className="fa-sharp fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>
      <div className="profile-dropdown-container">
        <ul className={ulClassName} ref={ulRef}>
          <li id='profile-username'>Hello, {user.username}</li>
          <li id='profile-email'>{user.email}</li>
          <li id='profile-manage-spots'><NavLink exact to='/spots/current'>Manage Spots</NavLink></li>
          <li>
            <button onClick={logout} id='log-out-button'>Log Out</button>
          </li>
        </ul>

      </div>
    </>
  );
}

export default ProfileButton;
