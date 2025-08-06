import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskApi } from '@core/task.api';

import { TaskModel } from 'src/app/features/todo/model/task.model';

@Injectable()
export class TodoService {
  public constructor(private taskApi: TaskApi) {}

  public getTasks(): Observable<TaskModel[]> {
    return this.taskApi.getAll();
  }

  public deleteTask(id: ID): Observable<unknown> {
    return this.taskApi.remove(id);
  }
}
