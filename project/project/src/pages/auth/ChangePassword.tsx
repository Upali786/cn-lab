import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { changePassword, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await changePassword(newPassword);
      
      if (success) {
        // Redirect to appropriate dashboard
        navigate(user?.role === 'faculty' ? '/faculty' : '/student');
      } else {
        setError('Failed to change password');
      }
    } catch (err) {
      setError('An error occurred while changing password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        <p>This is your first login. Please change your password to continue.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            icon={<Lock className="w-5 h-5" />}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;