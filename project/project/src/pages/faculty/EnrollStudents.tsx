import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { UserPlus, AlertCircle } from 'lucide-react';

const EnrollStudents: React.FC = () => {
  const { saveStudent } = useData();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !rollNumber || !email || !section) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const newStudent = {
        id: `s-${Date.now()}`,
        name,
        rollNumber,
        email,
        password: 'cse@nbkr',
        role: 'student' as const,
        sectionId: section,
        isFirstLogin: true
      };

      await saveStudent(newStudent);
      
      setSuccess('Student enrolled successfully!');
      setName('');
      setRollNumber('');
      setEmail('');
      setSection('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to enroll student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Enroll Students</h1>

      <Card className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Student Enrollment Form</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student's full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNumber" className="form-label">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              className="form-input"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter roll number"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="section" className="form-label">Section</label>
            <input
              type="text"
              id="section"
              className="form-input"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Enter section (e.g., CSE-A)"
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              icon={<UserPlus className="w-5 h-5" />}
              fullWidth
            >
              {loading ? 'Enrolling Student...' : 'Enroll Student'}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Note:</h3>
          <ul className="text-sm text-blue-800 list-disc list-inside">
            <li>Default password for new students is: cse@nbkr</li>
            <li>Students will be required to change their password on first login</li>
            <li>Make sure the email address is correct as it will be used for login</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default EnrollStudents;