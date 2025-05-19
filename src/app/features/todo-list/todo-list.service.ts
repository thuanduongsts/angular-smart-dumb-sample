import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApi } from '@core/task.api';

import { TaskModel } from './model/task.model';

@Injectable()
export class TodoListService {
  public constructor(private taskApi: TaskApi) {}

  public getTasks(): Observable<TaskModel[]> {
    return this.taskApi.getAll();
  }

  public updateTaskImportant(id: ID, important: boolean): Observable<unknown> {
    return this.taskApi.update(id, { important });
  }

  public deleteTask(id: ID): Observable<unknown> {
    return this.taskApi.delete(id);
  }
}
