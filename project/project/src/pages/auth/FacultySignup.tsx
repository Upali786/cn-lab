import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const FacultySignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { facultySignup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const faculty = await facultySignup(name, email, password);
      
      if (faculty) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Faculty Sign Up</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Account created successfully! Redirecting to login...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || success}
          />
        </div>
        
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
            disabled={loading || success}
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || success}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || success}
          />
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            disabled={loading || success}
            icon={<UserPlus className="w-5 h-5" />}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-900 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default FacultySignup;