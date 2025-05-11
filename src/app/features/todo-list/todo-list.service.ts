import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '@core/task.model';
import { TaskApi } from '@core/task.api';

@Injectable()
export class TodoListService {
  public constructor(private _api: TaskApi) {}

  public getTasks(): Observable<Task[]> {
    return this._api.get();
  }

  public updateCompleted(id: number, completed: boolean): Observable<void> {
    return this._api.update(id, { completed });
  }

  public updateImportant(id: number, important: boolean): Observable<void> {
    return this._api.update(id, { important });
  }

  public createTask(task: Omit<Task, 'id'>): Observable<void> {
    return this._api.create(task);
  }

  public deleteTask(id: number): Observable<void> {
    return this._api.delete(id);
  }

  public updateTask(id: number, body: Partial<Omit<Task, 'id'>>): Observable<void> {
    return this._api.update(id, body);
  }
} 