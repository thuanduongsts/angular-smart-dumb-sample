import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDAO } from './task.dao';

const apiUrl = '/api/v1/tasks';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  public constructor(private httpClient: HttpClient) {}

  public getTasks(): Observable<TaskDAO[]> {
    return this.httpClient.get<TaskDAO[]>(apiUrl);
  }

  public createTask(input: Omit<TaskDAO, 'id'>): Observable<unknown> {
    return this.httpClient.post<unknown>(apiUrl, input);
  }

  public updateTask(id: string, body: Partial<Omit<TaskDAO, 'id'>>): Observable<unknown> {
    return this.httpClient.patch<unknown>(`${apiUrl}/${id}`, body);
  }

  public delete(id: string): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${apiUrl}/${id}`);
  }
}
