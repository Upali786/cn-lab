import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import PieChart from '../../components/charts/PieChart';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { ChartData, Section } from '../../types';

const Dashboard: React.FC = () => {
  const { 
    students, experiments, studentExperimentStatus, sections,
    getStudentsBySection, getExperimentsCompletedCount, getVivaCompletedCount 
  } = useData();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const facultySections = sections.filter(section => section.facultyId === user?.id);
  
  // Get students for the selected section
  const filteredStudents = selectedSection === 'all' 
    ? students 
    : getStudentsBySection(selectedSection);
  
  // Count completed experiments and vivas
  const completedExperiments = selectedSection === 'all'
    ? studentExperimentStatus.filter(status => status.experimentCompleted).length
    : getExperimentsCompletedCount(selectedSection);
  
  const completedVivas = selectedSection === 'all'
    ? studentExperimentStatus.filter(status => status.vivaCompleted).length
    : getVivaCompletedCount(selectedSection);
  
  // Calculate total possible experiment-student combinations
  const totalPossibleExperiments = filteredStudents.length * experiments.length;
  const pendingExperiments = totalPossibleExperiments - completedExperiments;
  const pendingVivas = totalPossibleExperiments - completedVivas;

  // Prepare chart data
  const experimentChartData: ChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Experiments',
        data: [completedExperiments, pendingExperiments],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(203, 213, 225, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(203, 213, 225)'],
        borderWidth: 1,
      },
    ],
  };

  const vivaChartData: ChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Viva',
        data: [completedVivas, pendingVivas],
        backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(203, 213, 225, 0.6)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(203, 213, 225)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="mb-6">
        <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Section
        </label>
        <select
          id="section"
          className="form-select"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="all">All Sections</option>
          {facultySections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-900 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-semibold">{filteredStudents.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-teal-100 text-teal-900 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Experiments</p>
            <p className="text-2xl font-semibold">{experiments.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-900 mr-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Experiments</p>
            <p className="text-2xl font-semibold">{completedExperiments}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-900 mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Experiments</p>
            <p className="text-2xl font-semibold">{pendingExperiments}</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <PieChart 
          data={experimentChartData} 
          title="Experiment Completion Status"
        />
        
        <PieChart 
          data={vivaChartData} 
          title="Viva Completion Status"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Section Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Experiments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Vivas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {facultySections.map((section) => {
                const sectionStudents = getStudentsBySection(section.id);
                const sectionExperimentsCompleted = getExperimentsCompletedCount(section.id);
                const sectionVivaCompleted = getVivaCompletedCount(section.id);
                const totalPossible = sectionStudents.length * experiments.length;
                const completionRate = totalPossible > 0 
                  ? ((sectionExperimentsCompleted / totalPossible) * 100).toFixed(1) 
                  : '0';
                
                return (
                  <tr key={section.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {section.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sectionStudents.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sectionExperimentsCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sectionVivaCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {completionRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;