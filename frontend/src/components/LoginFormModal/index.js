import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true)
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6)  setDisableButton(false)
  }, [password, credential])

  useEffect(() => {
    if (credential.length < 4 || password.length < 6)  setDisableButton(true)
  }, [password, credential])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    history.push('/')
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const handleSubmitDemoUser = (e) => {
    e.preventDefault();
    setErrors([]);
    history.push('/')
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className="log-in">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className='log-in-form'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>

          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
            id='username'
            name="username"
          />
        </label>
        <label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </label>
        <button type="submit" id='log-in-button' disabled={disableButton} value="Login">Log In</button>
        <button onClick={handleSubmitDemoUser} id='log-in-demo-user'>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
