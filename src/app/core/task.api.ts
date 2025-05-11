import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

const apiUrl = '/api/v1/tasks';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  public constructor(private _http: HttpClient) {}

  public get(): Observable<Task[]> {
    return this._http.get<Task[]>(apiUrl);
  }

  public create(input: Omit<Task, 'id'>): Observable<void> {
    return this._http.post<void>(apiUrl, input);
  }

  public update(id: number, body: Partial<Omit<Task, 'id'>>): Observable<void> {
    return this._http.patch<void>(`${apiUrl}/${id}`, body);
  }

  public delete(id: number): Observable<void> {
    return this._http.delete<void>(`${apiUrl}/${id}`);
  }
} 