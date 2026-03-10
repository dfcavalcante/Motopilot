import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';

const RotaProtegida = ({ children }) => {
  const { user, isAuthInitializing } = useLogin();

  if (isAuthInitializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RotaProtegida;
