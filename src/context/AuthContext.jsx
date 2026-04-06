import React, { createContext, useState, useContext, useEffect } from 'react';
import { setAccessToken } from '../services/api';
import authService from '../services/authService';

/**
 * Context to manage user authentication state across the application.
 */
const AuthContext = createContext();

/**
 * Provider component that wraps the app and provides authentication state and actions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app mount, attempt a silent refresh to restore session from HttpOnly cookie
  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const data = await authService.refresh();
        // Decode basic user info from the access token payload
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        // Restore user info from localStorage (non-sensitive: name, email, role)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ id: payload.id, role: payload.role });
        }
      } catch {
        // Refresh token missing or expired — user must log in again
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  /**
   * Authenticates a user, stores access token in memory, and sets user state.
   */
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // Only store non-sensitive user info in localStorage for UI persistence
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  /**
   * Registers a new user.
   */
  const signup = async (name, email, password, role) => {
    const data = await authService.signup({ name, email, password, role });
    return data;
  };

  /**
   * Logs out the user: clears the HttpOnly cookie via the backend, and clears state.
   */
  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the Auth context.
 */
export const useAuth = () => useContext(AuthContext);

