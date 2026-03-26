import React, { createContext, useState, useContext, useEffect } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('@MotoPilot:user');
        const storedToken = localStorage.getItem('@MotoPilot:token');

        if (!storedUser || !storedToken) {
          setUser(null);
          return;
        }

        const response = await fetch('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('@MotoPilot:user');
          localStorage.removeItem('@MotoPilot:token');
          setUser(null);
          return;
        }

        const validatedUser = await response.json();
        localStorage.setItem('@MotoPilot:user', JSON.stringify(validatedUser));
        setUser(validatedUser);
      } catch (error) {
        console.error('Erro ao restaurar sessão do usuário:', error);
        localStorage.removeItem('@MotoPilot:user');
        localStorage.removeItem('@MotoPilot:token');
        setUser(null);
      } finally {
        setIsAuthInitializing(false);
      }
    };

    initAuth();
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

      const data = await response.json();

      // Salvar token e dados do usuário separadamente
      localStorage.setItem('@MotoPilot:token', data.access_token);
      localStorage.setItem('@MotoPilot:user', JSON.stringify(data.user));
      setUser(data.user);

      return true;
    } catch (error) {
      console.error('Erro ao fazer login (verifique se o usuário está cadastrado):', error);
      throw error;
    }
  };

  // ------- LOGOUT -----------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('@MotoPilot:user');
    localStorage.removeItem('@MotoPilot:token');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, isAuthInitializing }}>
      {children}
    </LoginContext.Provider>
  );
};

/**
 * Retorna os headers de autenticação para chamadas à API.
 * Pode ser importado e usado em qualquer contexto/serviço.
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('@MotoPilot:token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const useLogin = () => {
  return useContext(LoginContext);
};
