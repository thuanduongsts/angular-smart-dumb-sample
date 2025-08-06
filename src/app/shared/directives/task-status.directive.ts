import { computed, Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[appTaskStatus]'
})
export class TaskStatusDirective {
  readonly #backgroundColor = computed(() => {
    switch (this.status()) {
      case 'Todo':
        return '#6B7280';
      case 'In Progress':
        return '#3F83F8';
      default:
        return '#0E9F6E';
    }
  });

  public readonly status = input.required<TaskStatus>();

  @HostBinding('style')
  get statusStyle(): Record<string, string> {
    return {
      color: 'white',
      padding: '6px 8px',
      'background-color': this.#backgroundColor(),
      'border-radius': '6px',
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '20px',
      'letter-spacing': '0.1px',
    };
  }
}
