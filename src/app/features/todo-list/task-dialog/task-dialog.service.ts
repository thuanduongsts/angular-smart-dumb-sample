import { Injectable } from '@angular/core';
import { TaskModel } from '@common/models/task.model';
import { TaskApi } from '@core/task.api';
import { Observable } from 'rxjs';

@Injectable()
export class TaskDialogService {
  public constructor(private api: TaskApi) {}

  public createTask(data: Omit<TaskModel, 'id'>): Observable<unknown> {
    return this.api.add(data);
  }

  public updateTask(id: number, data: Partial<Omit<TaskModel, 'id'>>): Observable<unknown> {
    return this.api.edit(id, data);
  }

  public deleteTask(id: number): Observable<unknown> {
    return this.api.remove(id);
  }
}
