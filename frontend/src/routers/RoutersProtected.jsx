import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLogin } from '../context/LoginContext';

const normalizeRole = (funcao) =>
  String(funcao || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isCoordenador = (funcao) => {
  const role = normalizeRole(funcao);
  return (
    role === 'coordenador' ||
    role === 'coordenadora' ||
    role === 'gerente' ||
    role === 'administrador' ||
    role === 'admin'
  );
};

const RotaProtegida = ({ children, coordinatorOnly = false, redirectTo = '/dashboard' }) => {
  const { user, isAuthInitializing } = useLogin();

  if (isAuthInitializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (coordinatorOnly && !isCoordenador(user?.funcao)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RotaProtegida;
