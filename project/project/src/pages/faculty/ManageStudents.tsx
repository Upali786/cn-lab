import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Search, Eye, Trash2, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const ManageStudents: React.FC = () => {
  const { students, sections, studentExperimentStatus, deleteStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter students based on search and section
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === 'all' || student.sectionId === selectedSection;
    
    return matchesSearch && matchesSection;
  });

  const getStudentProgress = (studentId: string) => {
    const studentStatuses = studentExperimentStatus.filter(
      status => status.studentId === studentId
    );
    
    const completedExperiments = studentStatuses.filter(
      status => status.experimentCompleted
    ).length;
    
    const completedVivas = studentStatuses.filter(
      status => status.vivaCompleted
    ).length;
    
    return { completedExperiments, completedVivas };
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Manage Students</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by name, roll number, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <select
            className="form-select"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const { completedExperiments, completedVivas } = getStudentProgress(student.id);
                  
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge text={student.sectionId} variant="secondary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <div className="w-20">Experiments:</div>
                            <div className="ml-2">
                              <Badge 
                                text={`${completedExperiments}`}
                                variant={completedExperiments > 0 ? "success" : "secondary"}
                              />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-20">Vivas:</div>
                            <div className="ml-2">
                              <Badge 
                                text={`${completedVivas}`}
                                variant={completedVivas > 0 ? "info" : "secondary"}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye className="h-4 w-4" />}
                            onClick={() => navigate(`/faculty/students/${student.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => setShowDeleteConfirm(student.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteStudent(showDeleteConfirm)}
              >
                Delete Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;