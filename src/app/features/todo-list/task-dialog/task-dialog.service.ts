import { Injectable } from '@angular/core';
import { TaskApi } from '@core/task.api';
import { map, Observable } from 'rxjs';

import { TaskAddModel } from '../model/task-add.model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskDialogService {
  public constructor(private taskApi: TaskApi) {}

  public getDetails(id: ID): Observable<TaskModel> {
    return this.taskApi.getAll().pipe(map(tasks => tasks.find(t => t.id === id)!));
  }

  public create(data: TaskAddModel): Observable<TaskModel> {
    return this.taskApi.create(data);
  }

  public update(id: ID, data: Partial<TaskAddModel>): Observable<TaskModel> {
    return this.taskApi.update(id, data);
  }
}
