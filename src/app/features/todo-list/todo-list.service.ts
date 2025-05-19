import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApi } from '@core/task.api';

import { TaskModel } from './model/task.model';

@Injectable()
export class TodoListService {
  public constructor(private api: TaskApi) {}

  public getTasks(): Observable<TaskModel[]> {
    return this.api.getTasks();
  }

  public updateTaskImportant(id: ID, important: boolean): Observable<unknown> {
    return this.api.updateTask(id, { important });
  }

  public deleteTask(id: ID): Observable<unknown> {
    return this.api.deleteTask(id);
  }
}
