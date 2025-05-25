import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);
      
      if (user) {
        if (user.isFirstLogin) {
          navigate('/change-password');
        } else {
          navigate(user.role === 'faculty' ? '/faculty' : '/student');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            For students, default password is: cse@nbkr
          </p>
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            icon={<LogIn className="w-5 h-5" />}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Faculty member?{' '}
          <a
            href="/faculty/signup"
            className="text-blue-900 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate('/faculty/signup');
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;