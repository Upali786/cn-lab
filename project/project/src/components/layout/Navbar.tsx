import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isFaculty = user?.role === 'faculty';
  const baseRoute = isFaculty ? '/faculty' : '/student';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={baseRoute} className="flex items-center">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="font-semibold text-xl tracking-tight">NBKRIST</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {isFaculty ? (
                <>
                  <Link to="/faculty" className="px-3 py-2 rounded-md hover:bg-blue-800">Dashboard</Link>
                  <Link to="/faculty/students" className="px-3 py-2 rounded-md hover:bg-blue-800">Students</Link>
                  <Link to="/faculty/experiments" className="px-3 py-2 rounded-md hover:bg-blue-800">Experiments</Link>
                  <Link to="/faculty/viva" className="px-3 py-2 rounded-md hover:bg-blue-800">Viva Questions</Link>
                  <Link to="/faculty/enroll" className="px-3 py-2 rounded-md hover:bg-blue-800">Enroll Students</Link>
                </>
              ) : (
                <>
                  <Link to="/student" className="px-3 py-2 rounded-md hover:bg-blue-800">Dashboard</Link>
                  <Link to="/student/profile" className="px-3 py-2 rounded-md hover:bg-blue-800">My Profile</Link>
                </>
              )}
            </div>

            <div className="flex items-center ml-4 pl-4 border-l border-blue-800">
              <span className="mr-4">{user?.name}</span>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-800"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-800"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isFaculty ? (
              <>
                <Link
                  to="/faculty"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/faculty/students"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Students
                </Link>
                <Link
                  to="/faculty/experiments"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Experiments
                </Link>
                <Link
                  to="/faculty/viva"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Viva Questions
                </Link>
                <Link
                  to="/faculty/enroll"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Enroll Students
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/student"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/profile"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="flex items-center px-3">
                <div className="text-base font-medium">{user?.name}</div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-800 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;