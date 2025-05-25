import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface StudentRouteProps {
  children: React.ReactNode;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'student') {
    return <Navigate to="/faculty" />;
  }

  return <>{children}</>;
};

export default StudentRoute;