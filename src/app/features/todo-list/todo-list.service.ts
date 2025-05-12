import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskModel } from '@common/models/task.model';
import { TaskApi } from '@core/task.api';

@Injectable()
export class TodoListService {
  public constructor(private taskApi: TaskApi) {}

  public getTasks(): Observable<TaskModel[]> {
    return this.taskApi.getTasks();
  }

  public getDetails(id: number): Observable<TaskModel> {
    return this.taskApi.getTasks().pipe(map(tasks => tasks.find(t => t.id === id)!));
  }

  public updateCompleted(id: number, completed: boolean): Observable<unknown> {
    return this.taskApi.edit(id, { completed });
  }

  public updateImportant(id: number, important: boolean): Observable<unknown> {
    return this.taskApi.edit(id, { important });
  }

  public createTask(task: Omit<TaskModel, 'id'>): Observable<unknown> {
    return this.taskApi.add(task);
  }

  public deleteTask(id: number): Observable<unknown> {
    return this.taskApi.remove(id);
  }

  public updateTask(id: number, body: Partial<Omit<TaskModel, 'id'>>): Observable<unknown> {
    return this.taskApi.edit(id, body);
  }
}
