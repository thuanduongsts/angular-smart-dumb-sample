import { TaskModel } from './task.model';

export type TaskPayload = Omit<TaskModel, 'id'>;
