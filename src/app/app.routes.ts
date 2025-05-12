import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todo-list'
  },
  {
    path: 'todo-list',
    loadComponent: () => import('./features/todo-list/todo-list.component').then(c => c.TodoListComponent)
  }
];
