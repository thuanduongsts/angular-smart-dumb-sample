import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { StaticDataModel } from '../models/static-data.model';

@Injectable()
export class StaticDataService {
  public getListPriority(): Observable<StaticDataModel[]> {
    return of([
      { id: 'High', name: 'High' },
      { id: 'Medium', name: 'Medium' },
      { id: 'Low', name: 'Low' }
    ]);
  }

  public getListTaskStatus(): Observable<StaticDataModel[]> {
    return of([
      { id: 'Todo', name: 'Todo' },
      { id: 'In Progress', name: 'In Progress' },
      { id: 'Completed', name: 'Completed' }
    ]);
  }
}
