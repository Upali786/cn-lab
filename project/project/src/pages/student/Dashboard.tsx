import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { FileText, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    experiments, 
    getStatusForStudentExperiment, 
    getVivaQuestionsForExperiment,
    loading
  } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

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
  ).length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-900 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Experiments</p>
            <p className="text-2xl font-semibold">{experiments.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-900 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-semibold">{completedExperiments}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-900 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-semibold">{experiments.length - completedExperiments}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-teal-100 text-teal-900 mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-semibold">
              {experimentsWithStatus.some(exp => exp.status?.vivaCompleted)
                ? Math.round(
                    experimentsWithStatus.reduce(
                      (total, exp) => total + (exp.status?.vivaScore || 0),
                      0
                    ) / Math.max(1, experimentsWithStatus.filter(exp => exp.status?.vivaCompleted).length)
                  )
                : '-'}
            </p>
          </div>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">My Experiments</h2>
        </div>
        
        {experimentsWithStatus.length === 0 ? (
          <div className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No experiments have been assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Experiment</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Viva</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {experimentsWithStatus.map((experiment) => (
                  <tr key={experiment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-900" />
                        <div>
                          <div className="font-medium">{experiment.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {experiment.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <StatusBadge 
                          isCompleted={experiment.status?.packetTracerCompleted || false} 
                          text="Packet Tracer" 
                        />
                        <StatusBadge 
                          isCompleted={experiment.status?.experimentCompleted || false} 
                          text="Experiment" 
                        />
                        <StatusBadge 
                          isCompleted={experiment.status?.pdfSubmitted || false} 
                          text="PDF Submitted" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {experiment.status?.vivaCompleted ? (
                        <div className="text-sm">
                          <span className="font-medium">Score: </span>
                          <span className="text-green-700 font-medium">
                            {experiment.status.vivaScore}/{experiment.vivaQuestions.length * 10}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {experiment.vivaQuestions.length} questions
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/student/experiment/${experiment.id}`}
                        className="text-blue-900 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {experimentsWithStatus
            .filter(exp => exp.status)
            .sort((a, b) => 
              (b.status?.lastUpdated || 0) - (a.status?.lastUpdated || 0)
            )
            .slice(0, 5)
            .map(exp => (
              <div key={exp.id} className="flex items-start pb-4 border-b border-gray-100">
                <div className="p-2 rounded-full bg-blue-100 text-blue-900 mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-600">
                    {exp.status?.pdfSubmitted 
                      ? 'PDF submitted' 
                      : exp.status?.experimentCompleted 
                        ? 'Experiment completed' 
                        : 'Status updated'}
                    {exp.status?.lastUpdated && 
                      ` on ${new Date(exp.status.lastUpdated).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
            ))}
          
          {experimentsWithStatus.filter(exp => exp.status).length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;