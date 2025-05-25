import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const ManageExperiments: React.FC = () => {
  const { experiments, vivaQuestions, addExperiment, addVivaQuestion } = useData();
  const { user } = useAuth();
  const [showAddExperiment, setShowAddExperiment] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  
  // Form state for new experiment
  const [newExperimentTitle, setNewExperimentTitle] = useState('');
  const [newExperimentDescription, setNewExperimentDescription] = useState('');
  
  // Form state for new question
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  
  const handleAddExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExperimentTitle || !newExperimentDescription) {
      alert('Please fill in all fields');
      return;
    }
    
    const result = await addExperiment({
      title: newExperimentTitle,
      description: newExperimentDescription,
      facultyId: user?.id || '',
    });
    
    if (result) {
      setNewExperimentTitle('');
      setNewExperimentDescription('');
      setShowAddExperiment(false);
    }
  };
  
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExperiment || !newQuestion || options.some(opt => !opt) || correctOptionIndex === undefined) {
      alert('Please fill in all fields');
      return;
    }
    
    const result = await addVivaQuestion({
      experimentId: selectedExperiment,
      question: newQuestion,
      options: [...options],
      correctOptionIndex,
    });
    
    if (result) {
      setNewQuestion('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setShowAddQuestion(false);
    }
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Experiments</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setShowAddExperiment(true);
              setShowAddQuestion(false);
            }}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Experiment
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddQuestion(true);
              setShowAddExperiment(false);
              setSelectedExperiment(experiments.length > 0 ? experiments[0].id : null);
            }}
            icon={<Plus className="h-4 w-4" />}
            disabled={experiments.length === 0}
          >
            Add Viva Question
          </Button>
        </div>
      </div>
      
      {showAddExperiment && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Experiment</h2>
          <form onSubmit={handleAddExperiment}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                className="form-input"
                value={newExperimentTitle}
                onChange={(e) => setNewExperimentTitle(e.target.value)}
                placeholder="Enter experiment title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-input"
                rows={3}
                value={newExperimentDescription}
                onChange={(e) => setNewExperimentDescription(e.target.value)}
                placeholder="Enter experiment description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddExperiment(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Experiment</Button>
            </div>
          </form>
        </Card>
      )}
      
      {showAddQuestion && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Viva Question</h2>
          <form onSubmit={handleAddQuestion}>
            <div className="form-group">
              <label htmlFor="experiment" className="form-label">Experiment</label>
              <select
                id="experiment"
                className="form-select"
                value={selectedExperiment || ''}
                onChange={(e) => setSelectedExperiment(e.target.value)}
              >
                {experiments.map(exp => (
                  <option key={exp.id} value={exp.id}>
                    {exp.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="question" className="form-label">Question</label>
              <input
                type="text"
                id="question"
                className="form-input"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter question"
              />
            </div>
            
            <div className="mb-4">
              <p className="form-label">Options</p>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="correctOption"
                      checked={correctOptionIndex === index}
                      onChange={() => setCorrectOptionIndex(index)}
                      className="h-4 w-4 text-blue-900 focus:ring-blue-900"
                    />
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Select the radio button next to the correct answer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddQuestion(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Question</Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {experiments.map(experiment => {
          const experimentQuestions = vivaQuestions.filter(
            q => q.experimentId === experiment.id
          );
          
          return (
            <Card key={experiment.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-900" />
                    {experiment.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{experiment.description}</p>
                </div>
                <Badge
                  text={`${experimentQuestions.length} Questions`}
                  variant={experimentQuestions.length > 0 ? "info" : "secondary"}
                />
              </div>
              
              {experimentQuestions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Viva Questions</h3>
                  <div className="space-y-3">
                    {experimentQuestions.map(q => (
                      <div key={q.id} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{q.question}</p>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((option, index) => (
                            <div 
                              key={index} 
                              className={`text-sm p-2 rounded ${
                                index === q.correctOptionIndex 
                                  ? 'bg-green-100 border border-green-300' 
                                  : 'bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {index === q.correctOptionIndex && (
                                <span className="font-bold mr-1">✓</span>
                              )}
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddQuestion(true);
                    setShowAddExperiment(false);
                    setSelectedExperiment(experiment.id);
                  }}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Question
                </Button>
              </div>
            </Card>
          );
        })}
        
        {experiments.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Experiments</h3>
            <p className="text-gray-600 mb-4">
              You haven't added any experiments yet. Click the "Add Experiment" button to get started.
            </p>
            <Button
              onClick={() => setShowAddExperiment(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Experiment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExperiments;