export interface TaskDAO {
  id: ID;
  title: string;
  description: string;
  completed: boolean;
  important: boolean;
}
