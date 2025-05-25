import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface FirstLoginRouteProps {
  children: React.ReactNode;
}

const FirstLoginRoute: React.FC<FirstLoginRouteProps> = ({ children }) => {
  const { isAuthenticated, isFirstLogin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isFirstLogin) {
    return <Navigate to={user?.role === 'faculty' ? '/faculty' : '/student'} />;
  }

  return <>{children}</>;
};

export default FirstLoginRoute;