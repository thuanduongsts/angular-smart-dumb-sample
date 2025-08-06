import { TaskModel } from '../../model/task.model';

export type TaskAddModel = Omit<TaskModel, 'id'>;
