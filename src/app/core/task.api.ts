import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '@common/models/task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly apiUrl = '/api/v1/tasks';

  public constructor(private httpClient: HttpClient) {}

  public getTasks(): Observable<TaskModel[]> {
    return this.httpClient.get<TaskModel[]>(this.apiUrl);
  }

  public add(input: Omit<TaskModel, 'id'>): Observable<unknown> {
    return this.httpClient.post<unknown>(this.apiUrl, input);
  }

  public edit(id: number, body: Partial<Omit<TaskModel, 'id'>>): Observable<unknown> {
    return this.httpClient.patch<unknown>(`${this.apiUrl}/${id}`, body);
  }

  public remove(id: number): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.apiUrl}/${id}`);
  }
}
