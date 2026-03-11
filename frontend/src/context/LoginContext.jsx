import React, { createContext, useState, useContext, useEffect } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('@SeuApp:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão do usuário:', error);
      localStorage.removeItem('@SeuApp:user');
      setUser(null);
    } finally {
      setIsAuthInitializing(false);
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Email ou senha incorretos');
      }

      const userData = await response.json();

      setUser(userData);
      localStorage.setItem('@SeuApp:user', JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Erro ao fazer login (verifique se o usuário está cadastrado):', error);
      throw error;
    }
  };

  // ------- LOGOUT -----------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('@SeuApp:user');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, isAuthInitializing }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  return useContext(LoginContext);
};
