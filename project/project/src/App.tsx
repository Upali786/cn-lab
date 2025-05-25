import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import FacultySignup from './pages/auth/FacultySignup';
import ChangePassword from './pages/auth/ChangePassword';

// Faculty pages
import FacultyDashboard from './pages/faculty/Dashboard';
import ManageStudents from './pages/faculty/ManageStudents';
import ManageExperiments from './pages/faculty/ManageExperiments';
import ManageViva from './pages/faculty/ManageViva';
import EnrollStudents from './pages/faculty/EnrollStudents';
import StudentDetails from './pages/faculty/StudentDetails';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import ExperimentDetail from './pages/student/ExperimentDetail';
import Profile from './pages/student/Profile';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import FacultyRoute from './components/guards/FacultyRoute';
import StudentRoute from './components/guards/StudentRoute';
import FirstLoginRoute from './components/guards/FirstLoginRoute';

function App() {
  const { isAuthenticated, isFirstLogin, user } = useAuth();

  return (
    <Routes>
      {/* Authentication routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          isAuthenticated ? 
            (isFirstLogin ? <Navigate to="/change-password" /> : <Navigate to={user?.role === 'faculty' ? '/faculty' : '/student'} />) : 
            <Login />
        } />
        <Route path="/faculty/signup" element={<FacultySignup />} />
        <Route path="/change-password" element={
          <FirstLoginRoute>
            <ChangePassword />
          </FirstLoginRoute>
        } />
      </Route>

      {/* Faculty routes */}
      <Route element={
        <ProtectedRoute>
          <FacultyRoute>
            <Layout />
          </FacultyRoute>
        </ProtectedRoute>
      }>
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/students" element={<ManageStudents />} />
        <Route path="/faculty/students/:id" element={<StudentDetails />} />
        <Route path="/faculty/experiments" element={<ManageExperiments />} />
        <Route path="/faculty/viva" element={<ManageViva />} />
        <Route path="/faculty/enroll" element={<EnrollStudents />} />
      </Route>

      {/* Student routes */}
      <Route element={
        <ProtectedRoute>
          <StudentRoute>
            <Layout />
          </StudentRoute>
        </ProtectedRoute>
      }>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/experiment/:id" element={<ExperimentDetail />} />
        <Route path="/student/profile" element={<Profile />} />
      </Route>

      {/* Default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;