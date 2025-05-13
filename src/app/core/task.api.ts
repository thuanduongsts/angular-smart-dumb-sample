import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDAO } from './task.dao';

const apiUrl = '/api/v1/tasks';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  public constructor(private httpClient: HttpClient) {}

  public getTasks(): Observable<TaskDAO[]> {
    return this.httpClient.get<TaskDAO[]>(apiUrl);
  }

  public createTask(input: Omit<TaskDAO, 'id'>): Observable<TaskDAO> {
    return this.httpClient.post<TaskDAO>(apiUrl, input);
  }

  public updateTask(id: ID, body: Partial<Omit<TaskDAO, 'id'>>): Observable<TaskDAO> {
    return this.httpClient.patch<TaskDAO>(`${apiUrl}/${id}`, body);
  }

  public deleteTask(id: ID): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${apiUrl}/${id}`);
  }
}
