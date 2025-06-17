
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/blog';
import { authAPI } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  admin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setAuthState({
            isAuthenticated: true,
            user: userData.user,
          });
          console.log('User authenticated from stored token');
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          console.log('Invalid token, user logged out');
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Store the token
      localStorage.setItem('auth_token', response.token);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
      });
      
      console.log('Login successful', response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

    const admin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Store the token
      localStorage.setItem('auth_token', response.token);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
      });
      
      console.log('Login successful', response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      
      // Store the token
      localStorage.setItem('auth_token', response.token);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
      });
      
      console.log('Registration successful', response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ ...authState, admin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
