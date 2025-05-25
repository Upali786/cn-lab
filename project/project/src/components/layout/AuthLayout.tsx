import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/nbkrist-logo.png" 
              alt="NBKRIST Logo" 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-blue-900">NBKR Institute of Science and Technology</h1>
            <p className="text-gray-600 mt-2">Computer Networks Lab Evaluation System</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;