interface TaskDAO {
  id: ID;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}
