import { TaskModel } from './task.model';

export type TaskAddModel = Omit<TaskModel, 'id'>;
