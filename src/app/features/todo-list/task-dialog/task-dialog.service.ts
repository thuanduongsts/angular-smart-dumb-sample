import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '@core/task.model';
import { TaskApi } from '@core/task.api';

@Injectable()
export class TaskDialogService {
  public constructor(private _api: TaskApi) {}

  public getDetails(id: number): Observable<Task> {
    // Lấy chi tiết 1 task (mockapi không có endpoint riêng, lấy all rồi filter)
    return new Observable(subscriber => {
      this._api.get().subscribe(tasks => {
        const found = tasks.find(t => t.id === id);
        subscriber.next(found!);
        subscriber.complete();
      });
    });
  }

  public createTask(data: Omit<Task, 'id'>): Observable<void> {
    return this._api.create(data);
  }

  public updateTask(id: number, data: Partial<Omit<Task, 'id'>>): Observable<void> {
    return this._api.update(id, data);
  }

  public deleteTask(id: number): Observable<void> {
    return this._api.delete(id);
  }
} 