import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './index.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [disablButton, setDisableButton] = useState(true)

  useEffect(() => {
    if (email.length && username.length && firstName.length && lastName.length && password.length && confirmPassword.length)  setDisableButton(false)
  }, [email, username, firstName, lastName, password, confirmPassword])

  useEffect(() => {
    if (!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length)  setDisableButton(true)
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <div id='sign-up'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} id='sign-up-form'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </label>
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
          />
        </label>
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
          />
        </label>
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Last Name'
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
        </label>
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
          />
        </label>
        <button type="submit" id='sign-in-button' disabled={disablButton}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
