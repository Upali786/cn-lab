import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Faculty, Student } from '../types';
import { getUsers, saveFaculty, updateUser } from '../services/database';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  facultySignup: (name: string, email: string, password: string) => Promise<Faculty | null>;
  changePassword: (newPassword: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  // Check for logged in user on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsFirstLogin(parsedUser.isFirstLogin || false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const users = await getUsers();
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        setIsFirstLogin(foundUser.isFirstLogin || false);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return foundUser;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const facultySignup = async (name: string, email: string, password: string): Promise<Faculty | null> => {
    try {
      const faculty: Faculty = {
        id: `f-${Date.now()}`,
        name,
        email,
        password,
        role: 'faculty',
        isFirstLogin: false,
      };

      const savedFaculty = await saveFaculty(faculty);
      return savedFaculty;
    } catch (error) {
      console.error('Faculty signup error:', error);
      return null;
    }
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = { 
        ...user, 
        password: newPassword,
        isFirstLogin: false 
      };
      
      await updateUser(updatedUser);
      setUser(updatedUser);
      setIsFirstLogin(false);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isFirstLogin,
        login,
        facultySignup,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};