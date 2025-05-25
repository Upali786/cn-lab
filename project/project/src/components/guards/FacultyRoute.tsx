import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface FacultyRouteProps {
  children: React.ReactNode;
}

const FacultyRoute: React.FC<FacultyRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'faculty') {
    return <Navigate to="/student" />;
  }

  return <>{children}</>;
};

export default FacultyRoute;