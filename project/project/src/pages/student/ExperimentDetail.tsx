import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft, FileText, Upload, Check, X, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { VivaAnswer } from '../../types';

const ExperimentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getExperimentById, 
    getVivaQuestionsForExperiment, 
    getStatusForStudentExperiment,
    updateExperimentStatus
  } = useData();
  
  const [experiment, setExperiment] = useState(getExperimentById(id || ''));
  const [vivaQuestions, setVivaQuestions] = useState(getVivaQuestionsForExperiment(id || ''));
  const [experimentStatus, setExperimentStatus] = useState(
    user ? getStatusForStudentExperiment(user.id, id || '') : undefined
  );
  
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vivaAnswers, setVivaAnswers] = useState<VivaAnswer[]>([]);
  const [vivaScore, setVivaScore] = useState(0);
  
  useEffect(() => {
    if (!experiment) {
      navigate('/student');
    }
  }, [experiment, navigate]);
  
  if (!experiment || !user) {
    return null;
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!pdfFile) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the file to a server
      // Here we'll just simulate it
      const pdfUrl = URL.createObjectURL(pdfFile);
      
      await updateExperimentStatus({
        id: experimentStatus?.id,
        studentId: user.id,
        experimentId: experiment.id,
        packetTracerCompleted: experimentStatus?.packetTracerCompleted || false,
        experimentCompleted: experimentStatus?.experimentCompleted || false,
        pdfSubmitted: true,
        pdfUrl,
        vivaCompleted: experimentStatus?.vivaCompleted || false,
        vivaAnswers: experimentStatus?.vivaAnswers || [],
        vivaScore: experimentStatus?.vivaScore,
        facultyRemarks: experimentStatus?.facultyRemarks,
        lastUpdated: Date.now()
      });
      
      setExperimentStatus(getStatusForStudentExperiment(user.id, experiment.id));
      setPdfFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const handleSubmitViva = async () => {
    if (Object.keys(selectedAnswers).length !== vivaQuestions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate score and prepare answers
      let score = 0;
      const answers: VivaAnswer[] = [];
      
      vivaQuestions.forEach(question => {
        const selectedIndex = selectedAnswers[question.id];
        const isCorrect = selectedIndex === question.correctOptionIndex;
        
        if (isCorrect) {
          score += 10;
        }
        
        answers.push({
          questionId: question.id,
          selectedOptionIndex: selectedIndex,
          isCorrect
        });
      });
      
      await updateExperimentStatus({
        id: experimentStatus?.id,
        studentId: user.id,
        experimentId: experiment.id,
        packetTracerCompleted: experimentStatus?.packetTracerCompleted || false,
        experimentCompleted: experimentStatus?.experimentCompleted || false,
        pdfSubmitted: experimentStatus?.pdfSubmitted || false,
        pdfUrl: experimentStatus?.pdfUrl,
        vivaCompleted: true,
        vivaAnswers: answers,
        vivaScore: score,
        facultyRemarks: experimentStatus?.facultyRemarks,
        lastUpdated: Date.now()
      });
      
      setVivaAnswers(answers);
      setVivaScore(score);
      setShowResults(true);
      setExperimentStatus(getStatusForStudentExperiment(user.id, experiment.id));
    } catch (error) {
      console.error('Error submitting viva:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/student')}
          className="mr-3 p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Experiment Details</h1>
      </div>
      
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 mr-2 text-blue-900" />
              <h2 className="text-xl font-semibold">{experiment.title}</h2>
            </div>
            <p className="text-gray-600">{experiment.description}</p>
          </div>
          {experimentStatus?.facultyRemarks && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md max-w-xs">
              <p className="font-medium text-sm mb-1">Faculty Remarks:</p>
              <p className="text-sm">{experimentStatus.facultyRemarks}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium mb-3">Status</h3>
            <div className="space-y-3">
              <StatusBadge 
                isCompleted={experimentStatus?.packetTracerCompleted || false} 
                text="Packet Tracer Completed" 
              />
              <div className="block">
                <StatusBadge 
                  isCompleted={experimentStatus?.experimentCompleted || false} 
                  text="Experiment Completed" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  (Faculty need to mark this as complete)
                </p>
              </div>
              <StatusBadge 
                isCompleted={experimentStatus?.pdfSubmitted || false} 
                text="PDF Submitted" 
              />
              <StatusBadge 
                isCompleted={experimentStatus?.vivaCompleted || false} 
                text="Viva Completed" 
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-medium mb-3">PDF Submission</h3>
            {experimentStatus?.pdfSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  PDF has been submitted
                </p>
                {experimentStatus.pdfUrl && (
                  <a 
                    href={experimentStatus.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-900 hover:underline mt-2 inline-block text-sm"
                  >
                    View Submitted PDF
                  </a>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload your experiment PDF
                  </label>
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={handleFileUpload}
                  disabled={!pdfFile || isSubmitting}
                  icon={<Upload className="h-4 w-4" />}
                  size="sm"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium mb-4">Viva Questions</h3>
        
        {vivaQuestions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">No viva questions available for this experiment.</p>
          </div>
        ) : experimentStatus?.vivaCompleted ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <h4 className="text-lg font-medium text-blue-900 mb-2">Viva Results</h4>
              <p className="text-blue-800">
                Your score: <span className="font-bold">{experimentStatus.vivaScore}</span> out of <span className="font-bold">{vivaQuestions.length * 10}</span>
              </p>
            </div>
            
            <div className="space-y-6">
              {vivaQuestions.map((question, index) => {
                const answer = experimentStatus.vivaAnswers?.find(a => a.questionId === question.id);
                const isCorrect = answer?.isCorrect;
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium">
                        Question {index + 1}: {question.question}
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`p-3 rounded-md flex items-center ${
                              optIndex === answer?.selectedOptionIndex
                                ? (isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')
                                : optIndex === question.correctOptionIndex && !isCorrect
                                  ? 'bg-green-50 border border-green-200 opacity-50'
                                  : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {optIndex === answer?.selectedOptionIndex && (
                              isCorrect 
                                ? <Check className="h-4 w-4 text-green-600 mr-2" />
                                : <X className="h-4 w-4 text-red-600 mr-2" />
                            )}
                            {optIndex === question.correctOptionIndex && !isCorrect && (
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                            )}
                            <span className={`${
                              optIndex === question.correctOptionIndex ? 'font-medium' : ''
                            }`}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
              <p className="text-yellow-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Complete the viva to get your score. You can only submit once.
              </p>
            </div>
            
            <form>
              <div className="space-y-6">
                {vivaQuestions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium">
                        Question {index + 1}: {question.question}
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center">
                            <input
                              type="radio"
                              id={`q${index}-opt${optIndex}`}
                              name={`question-${question.id}`}
                              className="h-4 w-4 text-blue-900 focus:ring-blue-900 mr-3"
                              checked={selectedAnswers[question.id] === optIndex}
                              onChange={() => handleAnswerSelect(question.id, optIndex)}
                              disabled={showResults || isSubmitting}
                            />
                            <label 
                              htmlFor={`q${index}-opt${optIndex}`}
                              className="flex-1 p-3 rounded-md bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleSubmitViva}
                  disabled={
                    Object.keys(selectedAnswers).length !== vivaQuestions.length || 
                    isSubmitting || 
                    showResults
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Viva'}
                </Button>
              </div>
            </form>
            
            {showResults && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h3 className="text-xl font-bold mb-4">Viva Results</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <p className="text-blue-800 text-center text-xl">
                      Your score: <span className="font-bold">{vivaScore}</span> out of <span className="font-bold">{vivaQuestions.length * 10}</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <Button onClick={() => window.location.reload()}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExperimentDetail;