import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TaskApi } from '@core/task.api';

import { TaskModel } from '../model/task.model';
import { FilterModel } from '../components/filter/filter.model';

@Injectable()
export class TodoService {
  public constructor(private taskApi: TaskApi) {}

  public getTasks(filter: FilterModel): Observable<TaskModel[]> {
    return this.taskApi.getAll().pipe(
      map(tasks => {
        const filterByTerm = tasks.filter(item => item.title.toLowerCase().includes(filter.searchTerm.toLowerCase()));
        const filterByStatues = filterByTerm.filter(item => filter.statuses.includes(item.status));
        return filterByStatues.sort((a, b) =>
          filter.sort === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );
      })
    );
  }

  public deleteTask(id: ID): Observable<unknown> {
    return this.taskApi.remove(id);
  }
}
