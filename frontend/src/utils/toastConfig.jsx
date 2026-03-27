import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = {
  success: (message, options = {}) => toast.success(message, options),
  error: (message, options = {}) => toast.error(message, options),
  warning: (message, options = {}) => toast.warning(message, options),
  info: (message, options = {}) => toast.info(message, options),
};

export const AppToastContainer = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
);
