// Base user type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'faculty' | 'student';
  isFirstLogin: boolean;
}

// Faculty specific type
export interface Faculty extends User {
  role: 'faculty';
}

// Student specific type
export interface Student extends User {
  role: 'student';
  rollNumber: string;
  sectionId: string;
}

// Section type
export interface Section {
  id: string;
  name: string;
  facultyId: string;
}

// Experiment type
export interface Experiment {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  facultyId: string;
}

// Viva question type
export interface VivaQuestion {
  id: string;
  experimentId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

// Student experiment status
export interface StudentExperimentStatus {
  id?: string;
  studentId: string;
  experimentId: string;
  packetTracerCompleted: boolean;
  experimentCompleted: boolean;
  pdfSubmitted: boolean;
  pdfUrl?: string;
  vivaCompleted: boolean;
  vivaAnswers?: VivaAnswer[];
  vivaScore?: number;
  facultyRemarks?: string;
  lastUpdated: number;
}

// Viva answer
export interface VivaAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

// Chart data type
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}