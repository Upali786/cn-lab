// Add deleteStudent function to the exports
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const students = await getStudents();
    const updatedStudents = students.filter(student => student.id !== studentId);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    // Also delete related experiment statuses
    const statuses = await getStudentExperimentStatus();
    const updatedStatuses = statuses.filter(status => status.studentId !== studentId);
    localStorage.setItem('studentExperimentStatus', JSON.stringify(updatedStatuses));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};