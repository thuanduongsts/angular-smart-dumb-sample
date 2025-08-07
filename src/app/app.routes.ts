import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todo-list'
  },
  {
    path: 'todo-list',
    loadComponent: () => import('@features/todo/todo.component').then(c => c.TodoComponent)
  }
];
