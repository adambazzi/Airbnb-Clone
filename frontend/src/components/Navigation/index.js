import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './index.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const title = useSelector(state => state.title);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className='logged-in'>
        <a href="https://www.linkedin.com/in/adam-bazzi/" target="_blank" rel="noopener noreferrer" className='menuItem'>LinkedIn</a>
        <a href="https://github.com/adambazzi" target="_blank" rel="noopener noreferrer" className='menuItem'>GitHub</a>
        <NavLink to='/spots/new'><button id='create-spot-button'>Create a Spot</button></NavLink>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className='login-signup'>
         <a href="https://www.linkedin.com/in/adam-bazzi/" target="_blank" rel="noopener noreferrer" className='menuItem'>LinkedIn</a>
        <a href="https://github.com/adambazzi" target="_blank" rel="noopener noreferrer" className='menuItem'>GitHub</a>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <ul className='nav-bar'>
      <li>
        <NavLink exact to="/" id='home-path'>
          <img src="https://d3ui957tjb5bqd.cloudfront.net/uploads/2015/09/airbnb-2.jpg" alt='logo' id='nav-bar-logo'></img>
          <div id='breezebnb-title'>Breezebnb</div>
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
