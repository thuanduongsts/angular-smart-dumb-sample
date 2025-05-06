import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {}
