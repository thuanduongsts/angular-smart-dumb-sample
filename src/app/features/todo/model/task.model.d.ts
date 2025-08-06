export interface TaskModel {
  id: ID;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}
