import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDAO } from './task.dao';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  readonly #apiUrl = '/api/v1/tasks';

  public constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<TaskDAO[]> {
    return this.httpClient.get<TaskDAO[]>(this.#apiUrl);
  }

  public create(input: Omit<TaskDAO, 'id'>): Observable<TaskDAO> {
    return this.httpClient.post<TaskDAO>(this.#apiUrl, input);
  }

  public update(id: ID, body: Partial<TaskDAO>): Observable<TaskDAO> {
    return this.httpClient.patch<TaskDAO>(`${this.#apiUrl}/${id}`, body);
  }

  public delete(id: ID): Observable<unknown> {
    return this.httpClient.delete<unknown>(`${this.#apiUrl}/${id}`);
  }
}
