import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  User 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isFaculty = user?.role === 'faculty';

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white">
            {user?.name.charAt(0)}
          </div>
        </div>
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold">{user?.name}</h3>
          <p className="text-sm text-gray-500">{isFaculty ? 'Faculty' : 'Student'}</p>
        </div>
        <nav className="space-y-2">
          {isFaculty ? (
            <>
              <Link
                to="/faculty"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === '/faculty'
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/faculty/students"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname.startsWith('/faculty/students')
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Students
              </Link>
              <Link
                to="/faculty/experiments"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname.startsWith('/faculty/experiments')
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5 mr-3" />
                Experiments
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/student"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === '/student'
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/student/profile"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === '/student/profile'
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                My Profile
              </Link>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;