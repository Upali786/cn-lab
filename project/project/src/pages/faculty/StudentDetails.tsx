import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, User, FileText, Check, X, MessageSquare } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PieChart from '../../components/charts/PieChart';
import { ChartData } from '../../types';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getStudentById, 
    experiments, 
    getStatusForStudentExperiment, 
    getVivaQuestionsForExperiment,
    updateExperimentStatus
  } = useData();
  
  const [student, setStudent] = useState(getStudentById(id || ''));
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  
  useEffect(() => {
    if (!student) {
      navigate('/faculty/students');
    }
  }, [student, navigate]);
  
  if (!student) {
    return null;
  }
  
  const experimentsWithStatus = experiments.map(exp => {
    const status = getStatusForStudentExperiment(student.id, exp.id);
    return {
      ...exp,
      status
    };
  });
  
  const completedExperimentsCount = experimentsWithStatus.filter(
    exp => exp.status?.experimentCompleted
  ).length;
  
  const completedVivasCount = experimentsWithStatus.filter(
    exp => exp.status?.vivaCompleted
  ).length;
  
  const handleTogglePacketTracer = async (experimentId: string, currentValue: boolean) => {
    const status = getStatusForStudentExperiment(student.id, experimentId);
    
    await updateExperimentStatus({
      id: status?.id,
      studentId: student.id,
      experimentId,
      packetTracerCompleted: !currentValue,
      experimentCompleted: status?.experimentCompleted || false,
      pdfSubmitted: status?.pdfSubmitted || false,
      pdfUrl: status?.pdfUrl,
      vivaCompleted: status?.vivaCompleted || false,
      vivaAnswers: status?.vivaAnswers || [],
      vivaScore: status?.vivaScore,
      lastUpdated: Date.now()
    });
  };
  
  const handleToggleExperimentCompleted = async (experimentId: string, currentValue: boolean) => {
    const status = getStatusForStudentExperiment(student.id, experimentId);
    
    await updateExperimentStatus({
      id: status?.id,
      studentId: student.id,
      experimentId,
      packetTracerCompleted: status?.packetTracerCompleted || false,
      experimentCompleted: !currentValue,
      pdfSubmitted: status?.pdfSubmitted || false,
      pdfUrl: status?.pdfUrl,
      vivaCompleted: status?.vivaCompleted || false,
      vivaAnswers: status?.vivaAnswers || [],
      vivaScore: status?.vivaScore,
      lastUpdated: Date.now()
    });
  };
  
  const handleSaveRemarks = async () => {
    if (!selectedExperiment) return;
    
    const status = getStatusForStudentExperiment(student.id, selectedExperiment);
    
    await updateExperimentStatus({
      id: status?.id,
      studentId: student.id,
      experimentId: selectedExperiment,
      packetTracerCompleted: status?.packetTracerCompleted || false,
      experimentCompleted: status?.experimentCompleted || false,
      pdfSubmitted: status?.pdfSubmitted || false,
      pdfUrl: status?.pdfUrl,
      vivaCompleted: status?.vivaCompleted || false,
      vivaAnswers: status?.vivaAnswers || [],
      vivaScore: status?.vivaScore,
      facultyRemarks: remarks,
      lastUpdated: Date.now()
    });
    
    setSelectedExperiment(null);
    setRemarks('');
  };
  
  // Prepare chart data
  const chartData: ChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Experiments',
        data: [completedExperimentsCount, experiments.length - completedExperimentsCount],
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
        data: [completedVivasCount, experiments.length - completedVivasCount],
        backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(203, 213, 225, 0.6)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(203, 213, 225)'],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/faculty/students')}
          className="mr-3 p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl mb-4">
              {student.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-gray-600">{student.rollNumber}</p>
            <p className="text-gray-600 mb-4">{student.email}</p>
            
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Experiments</p>
                <p className="text-xl font-semibold text-blue-900">
                  {completedExperimentsCount}/{experiments.length}
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Viva Score</p>
                <p className="text-xl font-semibold text-teal-900">
                  {experimentsWithStatus.reduce((total, exp) => total + (exp.status?.vivaScore || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Experiment Completion</h3>
            <PieChart data={chartData} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Viva Completion</h3>
            <PieChart data={vivaChartData} />
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4">Experiments Status</h3>
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
                  PDF Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viva Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experimentsWithStatus.map((experiment) => {
                const vivaQuestions = getVivaQuestionsForExperiment(experiment.id);
                
                return (
                  <tr key={experiment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-900" />
                        <div>
                          <div className="font-medium text-gray-900">{experiment.title}</div>
                          <div className="text-sm text-gray-500">{vivaQuestions.length} viva questions</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex">
                        <button
                          onClick={() => handleTogglePacketTracer(
                            experiment.id, 
                            experiment.status?.packetTracerCompleted || false
                          )}
                          className="flex items-center"
                        >
                          <StatusBadge 
                            isCompleted={experiment.status?.packetTracerCompleted || false} 
                            text="Packet Tracer" 
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex">
                        <button
                          onClick={() => handleToggleExperimentCompleted(
                            experiment.id, 
                            experiment.status?.experimentCompleted || false
                          )}
                          className="flex items-center"
                        >
                          <StatusBadge 
                            isCompleted={experiment.status?.experimentCompleted || false} 
                            text="Experiment" 
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge 
                        isCompleted={experiment.status?.pdfSubmitted || false} 
                        text="PDF Submitted" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {experiment.status?.vivaCompleted ? (
                        <span className="font-medium">
                          {experiment.status.vivaScore}/{vivaQuestions.length * 10}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not taken</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<MessageSquare className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedExperiment(experiment.id);
                          setRemarks(experiment.status?.facultyRemarks || '');
                        }}
                      >
                        Remarks
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {selectedExperiment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Faculty Remarks
            </h3>
            <textarea
              className="form-input w-full h-32"
              placeholder="Enter your remarks for this experiment..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedExperiment(null);
                  setRemarks('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRemarks}>Save Remarks</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;