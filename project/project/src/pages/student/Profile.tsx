import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import PieChart from '../../components/charts/PieChart';
import { User, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { ChartData } from '../../types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { 
    experiments, 
    getStatusForStudentExperiment, 
    getVivaQuestionsForExperiment,
    sections
  } = useData();
  
  if (!user) {
    return null;
  }
  
  const experimentsWithStatus = experiments.map(exp => {
    const status = getStatusForStudentExperiment(user.id, exp.id);
    const vivaQuestions = getVivaQuestionsForExperiment(exp.id);
    
    return {
      ...exp,
      status,
      vivaQuestions
    };
  });
  
  const completedExperiments = experimentsWithStatus.filter(
    exp => exp.status?.experimentCompleted
  );
  
  const completedVivas = experimentsWithStatus.filter(
    exp => exp.status?.vivaCompleted
  );
  
  const totalVivaScore = completedVivas.reduce(
    (total, exp) => total + (exp.status?.vivaScore || 0), 
    0
  );
  
  const totalPossibleScore = completedVivas.reduce(
    (total, exp) => total + (exp.vivaQuestions.length * 10),
    0
  );
  
  const averageVivaScore = totalPossibleScore > 0 
    ? Math.round((totalVivaScore / totalPossibleScore) * 100) 
    : 0;
  
  // Get student section
  const studentSection = sections.find(section => {
    if ('sectionId' in user) {
      return section.id === (user as any).sectionId;
    }
    return false;
  });
  
  // Prepare chart data
  const experimentChartData: ChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Experiments',
        data: [
          completedExperiments.length, 
          experiments.length - completedExperiments.length
        ],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(203, 213, 225, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(203, 213, 225)'],
        borderWidth: 1,
      },
    ],
  };
  
  const scoreChartData: ChartData = {
    labels: ['Scored', 'Missed'],
    datasets: [
      {
        label: 'Viva Scores',
        data: [
          totalVivaScore,
          totalPossibleScore - totalVivaScore
        ],
        backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(203, 213, 225, 0.6)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(203, 213, 225)'],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            {'rollNumber' in user && (
              <p className="text-gray-600">{(user as any).rollNumber}</p>
            )}
            <p className="text-gray-600 mb-4">{user.email}</p>
            
            {studentSection && (
              <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-medium">
                Section: {studentSection.name}
              </div>
            )}
            
            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Experiments</p>
                <p className="text-xl font-semibold text-blue-900">
                  {completedExperiments.length}/{experiments.length}
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Viva Score</p>
                <p className="text-xl font-semibold text-teal-900">
                  {totalVivaScore}/{totalPossibleScore || '-'}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Experiment Progress</h3>
            <PieChart data={experimentChartData} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Viva Performance</h3>
            <PieChart data={scoreChartData} />
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4">Experiment-wise Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packet Tracer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PDF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viva Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experimentsWithStatus.map((experiment) => {
                return (
                  <tr key={experiment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-900" />
                        <div>
                          <div className="font-medium text-gray-900">{experiment.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {experiment.status?.packetTracerCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {experiment.status?.experimentCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {experiment.status?.pdfSubmitted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {experiment.status?.vivaCompleted ? (
                        <div className="flex items-center">
                          <span className="font-medium">
                            {experiment.status.vivaScore}/{experiment.vivaQuestions.length * 10}
                          </span>
                          <div 
                            className={`h-2 w-16 ml-2 rounded-full ${
                              experiment.status.vivaScore / (experiment.vivaQuestions.length * 10) >= 0.7
                                ? 'bg-green-500'
                                : experiment.status.vivaScore / (experiment.vivaQuestions.length * 10) >= 0.4
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">Not taken</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Profile;