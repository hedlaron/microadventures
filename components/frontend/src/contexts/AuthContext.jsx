import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function login(email, password) {
    try {
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      setCurrentUser(null);
      throw err;
    }
  }

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getUserName = () => {
    return currentUser ? currentUser.username : null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout,
        toggleModal,
        isAuthenticated: !!currentUser,
        getUserName,
        error,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ...existing code... */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {/* ...existing code... */}
    </>
  );
};