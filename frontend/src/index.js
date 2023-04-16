import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, Modal } from './context/Modal';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from './store/session';

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Modal />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<React.StrictMode><Root /></React.StrictMode>);
