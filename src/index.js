import React from 'react';
import ReactDOM from 'react-dom';
import './Gird.css';
import App from './App/App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Icon/css/uicons-regular-rounded.css';
import './Animation.css';

ReactDOM.render(
  <React.StrictMode>
      <App />
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='dark'
      />
  </React.StrictMode>,
  document.getElementById('root')
);