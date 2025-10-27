export { fetchTeacherGroups, fetchGroupById, fetchGroupStudents } from './groups';
export { 
  fetchTeacherTasks, 
  fetchTaskById, 
  fetchTaskSubmissions, 
  createTask, 
  updateTask, 
  deleteTask, 
  gradeSubmission 
} from './tasks';
export type { Task, TaskSubmission, CreateTaskData } from './tasks';
export type { TeacherGroup, GroupStudent } from './groups';

export { fetchHeatmapData, fetchSubtemas, fetchTeacherKPIs } from './analytics';
export type { HeatmapData, SubtemaCalificacion } from './analytics';
