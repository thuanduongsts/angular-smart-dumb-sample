import {
  ApplicationRef,
  booleanAttribute,
  createComponent,
  Directive,
  ElementRef,
  input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IconComponent, IconEnum } from '@ui';

@Directive({
  selector: '[taskPriority]'
})
export class TaskPriorityDirective implements OnChanges {
  public readonly hasIcon = input<boolean, StrOrBool>(true, { transform: booleanAttribute });
  public readonly priority = input.required<TaskPriority>();

  public constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private appRef: ApplicationRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const hasIconChange = changes['hasIcon'];
    if (!hasIconChange || this.hasIcon()) {
      this.#createIconElement();
    }
    this.#updateHostStyles();
  }

  #createIconElement(): void {
    const iconComponentRef = createComponent(IconComponent, {
      environmentInjector: this.appRef.injector
    });
    iconComponentRef.instance.name = IconEnum.PRIORITY_FLAG;

    const iconElement = iconComponentRef.location.nativeElement;
    this.renderer.insertBefore(this.el.nativeElement, iconElement, this.el.nativeElement.firstChild);
    this.renderer.setStyle(iconElement, 'background-color', this.#getPriorityHexColor());
  }

  #updateHostStyles(): void {
    this.renderer.setStyle(this.el.nativeElement, 'color', this.#getPriorityHexColor());
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'gap', '2px');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '16px');
  }

  #getPriorityHexColor(): string {
    if (this.priority() === 'High') {
      return '#C81E1E';
    }

    if (this.priority() === 'Medium') {
      return '#E3A008';
    }

    return '#046C4E';
  }
}
