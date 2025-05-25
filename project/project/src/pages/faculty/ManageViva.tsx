import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Plus, Edit, FileText, AlertCircle } from 'lucide-react';

const ManageViva: React.FC = () => {
  const { experiments, vivaQuestions, addVivaQuestion } = useData();
  const [selectedExperiment, setSelectedExperiment] = useState<string>('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  // Form state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExperiment || !question || options.some(opt => !opt)) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addVivaQuestion({
        id: `q-${Date.now()}`,
        experimentId: selectedExperiment,
        question,
        options: [...options],
        correctOptionIndex
      });

      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setShowAddQuestion(false);
    } catch (err) {
      setError('Failed to add question');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const experimentQuestions = vivaQuestions.filter(
    q => q.experimentId === selectedExperiment
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Viva Questions</h1>
        <Button
          onClick={() => setShowAddQuestion(true)}
          icon={<Plus className="h-4 w-4" />}
          disabled={!selectedExperiment}
        >
          Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Select Experiment</h2>
          <div className="space-y-2">
            {experiments.map(experiment => (
              <button
                key={experiment.id}
                onClick={() => setSelectedExperiment(experiment.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedExperiment === experiment.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <div>
                    <div className="font-medium">{experiment.title}</div>
                    <div className="text-sm opacity-80">
                      {vivaQuestions.filter(q => q.experimentId === experiment.id).length} questions
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {experiments.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No experiments available
              </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          {showAddQuestion ? (
            <Card>
              <h2 className="text-lg font-semibold mb-4">
                Add New Question
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="question" className="form-label">Question</label>
                  <input
                    type="text"
                    id="question"
                    className="form-input"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question"
                    disabled={loading}
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
                          disabled={loading}
                        />
                        <input
                          type="text"
                          className="form-input flex-1"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          disabled={loading}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the radio button next to the correct answer
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddQuestion(false);
                      setQuestion('');
                      setOptions(['', '', '', '']);
                      setCorrectOptionIndex(0);
                      setError('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Adding Question...' : 'Add Question'}
                  </Button>
                </div>
              </form>
            </Card>
          ) : selectedExperiment ? (
            <div className="space-y-4">
              {experimentQuestions.length > 0 ? (
                experimentQuestions.map(q => (
                  <Card key={q.id}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">{q.question}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="h-4 w-4" />}
                        onClick={() => setEditingQuestionId(q.id)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            index === q.correctOptionIndex
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {option}
                          {index === q.correctOptionIndex && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions added yet</p>
                  <Button
                    onClick={() => setShowAddQuestion(true)}
                    icon={<Plus className="h-4 w-4" />}
                    className="mt-4"
                  >
                    Add First Question
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select an experiment to manage its viva questions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageViva;