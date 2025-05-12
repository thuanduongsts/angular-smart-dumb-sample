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

  public updateCompleted(id: string, completed: boolean): Observable<unknown> {
    return this.api.updateTask(id, { completed });
  }

  public updateImportant(id: string, important: boolean): Observable<unknown> {
    return this.api.updateTask(id, { important });
  }
}
