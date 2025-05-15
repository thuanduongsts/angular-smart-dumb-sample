import { TaskModel } from './task.model';

export interface TaskDialogCloseMessage {
  type: 'created' | 'updated' | 'deleted';
  task: TaskModel;
}
