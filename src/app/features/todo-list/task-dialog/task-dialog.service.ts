import { Injectable } from '@angular/core';
import { TaskApi } from '@core/task.api';
import { map, Observable } from 'rxjs';

import { TaskPayload } from '../model/task-add.model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskDialogService {
  public constructor(private api: TaskApi) {}

  public getDetails(id: string): Observable<TaskModel> {
    return this.api.getTasks().pipe(map(tasks => tasks.find(t => t.id === id)!));
  }

  public createTask(data: TaskPayload): Observable<unknown> {
    return this.api.createTask(data);
  }

  public updateTask(id: string, data: TaskPayload): Observable<unknown> {
    return this.api.updateTask(id, data);
  }

  public deleteTask(id: string): Observable<unknown> {
    return this.api.deleteTask(id);
  }
}
