import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, Faculty, Experiment, VivaQuestion, 
  StudentExperimentStatus, Section 
} from '../types';
import { 
  getStudents, getFaculty, getExperiments, getVivaQuestions, 
  getStudentExperimentStatus, getSections,
  saveExperiment, saveVivaQuestion, saveStudentExperimentStatus,
  updateStudentExperimentStatus
} from '../services/database';
import { useAuth } from './AuthContext';

interface DataContextType {
  students: Student[];
  faculty: Faculty[];
  experiments: Experiment[];
  vivaQuestions: VivaQuestion[];
  studentExperimentStatus: StudentExperimentStatus[];
  sections: Section[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addExperiment: (experiment: Omit<Experiment, 'id'>) => Promise<Experiment | null>;
  addVivaQuestion: (question: Omit<VivaQuestion, 'id'>) => Promise<VivaQuestion | null>;
  updateExperimentStatus: (status: StudentExperimentStatus) => Promise<StudentExperimentStatus | null>;
  getStudentById: (id: string) => Student | undefined;
  getExperimentById: (id: string) => Experiment | undefined;
  getVivaQuestionsForExperiment: (experimentId: string) => VivaQuestion[];
  getStatusForStudentExperiment: (studentId: string, experimentId: string) => StudentExperimentStatus | undefined;
  getStudentsBySection: (sectionId: string) => Student[];
  getExperimentsCompletedCount: (sectionId?: string) => number;
  getVivaCompletedCount: (sectionId?: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [vivaQuestions, setVivaQuestions] = useState<VivaQuestion[]>([]);
  const [studentExperimentStatus, setStudentExperimentStatus] = useState<StudentExperimentStatus[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const refreshData = async () => {
    try {
      setLoading(true);
      const fetchedStudents = await getStudents();
      const fetchedFaculty = await getFaculty();
      const fetchedExperiments = await getExperiments();
      const fetchedVivaQuestions = await getVivaQuestions();
      const fetchedStatus = await getStudentExperimentStatus();
      const fetchedSections = await getSections();

      setStudents(fetchedStudents);
      setFaculty(fetchedFaculty);
      setExperiments(fetchedExperiments);
      setVivaQuestions(fetchedVivaQuestions);
      setStudentExperimentStatus(fetchedStatus);
      setSections(fetchedSections);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const addExperiment = async (experimentData: Omit<Experiment, 'id'>): Promise<Experiment | null> => {
    try {
      const newExperiment = await saveExperiment({
        ...experimentData,
        id: `exp-${Date.now()}`
      });
      
      setExperiments([...experiments, newExperiment]);
      return newExperiment;
    } catch (error) {
      console.error('Error adding experiment:', error);
      return null;
    }
  };

  const addVivaQuestion = async (questionData: Omit<VivaQuestion, 'id'>): Promise<VivaQuestion | null> => {
    try {
      const newQuestion = await saveVivaQuestion({
        ...questionData,
        id: `q-${Date.now()}`
      });
      
      setVivaQuestions([...vivaQuestions, newQuestion]);
      return newQuestion;
    } catch (error) {
      console.error('Error adding viva question:', error);
      return null;
    }
  };

  const updateExperimentStatus = async (status: StudentExperimentStatus): Promise<StudentExperimentStatus | null> => {
    try {
      // Check if status already exists
      const existingStatusIndex = studentExperimentStatus.findIndex(
        s => s.studentId === status.studentId && s.experimentId === status.experimentId
      );

      let updatedStatus;
      
      if (existingStatusIndex >= 0) {
        // Update existing status
        updatedStatus = await updateStudentExperimentStatus(status);
        
        // Update local state
        const updatedStatusList = [...studentExperimentStatus];
        updatedStatusList[existingStatusIndex] = updatedStatus;
        setStudentExperimentStatus(updatedStatusList);
      } else {
        // Create new status
        updatedStatus = await saveStudentExperimentStatus(status);
        setStudentExperimentStatus([...studentExperimentStatus, updatedStatus]);
      }
      
      return updatedStatus;
    } catch (error) {
      console.error('Error updating experiment status:', error);
      return null;
    }
  };

  // Helper functions
  const getStudentById = (id: string): Student | undefined => {
    return students.find(s => s.id === id);
  };

  const getExperimentById = (id: string): Experiment | undefined => {
    return experiments.find(e => e.id === id);
  };

  const getVivaQuestionsForExperiment = (experimentId: string): VivaQuestion[] => {
    return vivaQuestions.filter(q => q.experimentId === experimentId);
  };

  const getStatusForStudentExperiment = (studentId: string, experimentId: string): StudentExperimentStatus | undefined => {
    return studentExperimentStatus.find(
      s => s.studentId === studentId && s.experimentId === experimentId
    );
  };

  const getStudentsBySection = (sectionId: string): Student[] => {
    return students.filter(s => s.sectionId === sectionId);
  };

  const getExperimentsCompletedCount = (sectionId?: string): number => {
    const relevantStatuses = sectionId 
      ? studentExperimentStatus.filter(status => {
          const student = students.find(s => s.id === status.studentId);
          return student?.sectionId === sectionId && status.experimentCompleted;
        })
      : studentExperimentStatus.filter(status => status.experimentCompleted);
    
    return relevantStatuses.length;
  };

  const getVivaCompletedCount = (sectionId?: string): number => {
    const relevantStatuses = sectionId
      ? studentExperimentStatus.filter(status => {
          const student = students.find(s => s.id === status.studentId);
          return student?.sectionId === sectionId && status.vivaCompleted;
        })
      : studentExperimentStatus.filter(status => status.vivaCompleted);
    
    return relevantStatuses.length;
  };

  return (
    <DataContext.Provider
      value={{
        students,
        faculty,
        experiments,
        vivaQuestions,
        studentExperimentStatus,
        sections,
        loading,
        refreshData,
        addExperiment,
        addVivaQuestion,
        updateExperimentStatus,
        getStudentById,
        getExperimentById,
        getVivaQuestionsForExperiment,
        getStatusForStudentExperiment,
        getStudentsBySection,
        getExperimentsCompletedCount,
        getVivaCompletedCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};