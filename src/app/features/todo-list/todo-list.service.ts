import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApi } from '@core/task.api';

import { TaskModel } from './model/task.model';

@Injectable()
export class TodoListService {
  public constructor(private _api: TaskApi) {}

  public getTasks(): Observable<TaskModel[]> {
    return this._api.getTasks();
  }

  public updateCompleted(id: string, completed: boolean): Observable<unknown> {
    return this._api.updateTask(id, { completed });
  }

  public updateImportant(id: string, important: boolean): Observable<unknown> {
    return this._api.updateTask(id, { important });
  }
}
