import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ButtonComponent, TextInputComponent } from '@ui';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, TextInputComponent, FormsModule]
})
export class TodoListComponent {
  public readonly textInput = model<string>('');
}
