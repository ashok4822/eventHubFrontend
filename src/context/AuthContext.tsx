import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { setAccessToken } from '../services/api';
import authService from '../services/authService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<{ message: string; user: AuthUser }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides authentication state and actions.
 */
export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On app mount, attempt a silent refresh to restore session from HttpOnly cookie
  useEffect(() => {
    const tryRestoreSession = async (): Promise<void> => {
      try {
        const data = await authService.refresh();
        const payload = JSON.parse(atob(data.accessToken.split('.')[1])) as {
          id: string;
          role: string;
        };
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser) as AuthUser);
        } else {
          setUser({ id: payload.id, role: payload.role as 'user' | 'admin', name: '', email: '' });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const data = await authService.login(email, password);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role?: string
  ): Promise<{ message: string; user: AuthUser }> => {
    return await authService.signup({ name, email, password, role });
  };

  const logout = async (): Promise<void> => {
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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
