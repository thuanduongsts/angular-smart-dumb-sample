import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  Inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { combineLatest, fromEvent } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { SelectPanelComponent } from '../components/select-panel/select-panel.component';
import { SelectItemModel } from '../models/select-item.model';
import { IconEnum } from '../../icon/icon.enum';
import { BaseControlAccessor } from '../../directives/base-control-accessor.directive';

@Directive({})
export abstract class BaseSelectDirective extends BaseControlAccessor<ID[], ID | ID[]> implements OnInit {
  readonly #selectedValues = signal<ID[]>(this.getDefaultValue());

  protected abstract readonly isSearchable: boolean;
  protected readonly innerFilteredOptions = signal<SelectItemModel[]>([]);
  protected readonly innerFocusedIndex = signal<number>(-1);

  protected readonly IconEnum = IconEnum;
  protected readonly searchControl = new FormControl<string>('');

  protected readonly isPanelOpen = signal(false);
  protected readonly selectedOptions = computed(() => {
    return this.options().filter(e => this.#selectedValues()?.includes(e.id));
  });
  protected readonly focusIndex = this.innerFocusedIndex.asReadonly();
  protected readonly filteredOptions = this.innerFilteredOptions.asReadonly();
  protected readonly displaySelectedValues = computed(() => this.selectedOptions().map(it => it.name));
  protected readonly selectPanelComponent: Signal<Maybe<SelectPanelComponent>> = viewChild(SelectPanelComponent);
  protected readonly searchElement: Signal<Maybe<ElementRef<HTMLInputElement>>> = viewChild('searchElement', {
    read: ElementRef
  });

  public readonly options = input.required<SelectItemModel[]>();
  public readonly placeholder = input<string>('');
  public readonly panelClass = input<string>('');
  public readonly isMultiple = input<boolean, string | boolean>(false, { transform: booleanAttribute });
  public readonly uncheckAllowed = input<boolean, string | boolean>(false, { transform: booleanAttribute });
  public readonly options$ = toObservable(this.options);
  public readonly selectedValuesChange = output<ID[]>();

  get optionElements(): Readonly<Maybe<ElementRef<HTMLDivElement>[]>> {
    return this.selectPanelComponent()?.optionElements();
  }

  public constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected destroyRef: DestroyRef,
    protected elementRef: ElementRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.setupSearchChange();
    this.setupListenClickOutside();
    this.setupHandleKeydownEvent();
  }

  public override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    if (isDisabled) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  public override writeValue(value: ID | ID[]): void {
    super.writeValue(value);
    this.#selectedValues.set(this.formatInputValue(value));
  }

  public closePanel(): void {
    this.updateValue(this.#selectedValues());
    this.isPanelOpen.set(false);
  }

  public togglePanelSelection(): void {
    this.isPanelOpen.set(!this.isPanelOpen());
    this.updateAfterPanelOpen();
  }

  public selectChange(event: Event, option: SelectItemModel, index: number): void {
    event.stopPropagation();
    this.focusControlElement();
    this.innerFocusedIndex.set(index);
    this.focusOption(index);

    const value = this.#selectedValues();
    const isSelected = value.some(e => option.id === e);

    if (!this.isMultiple()) {
      if (isSelected && this.uncheckAllowed()) {
        this.#selectedValues.set([]);
      } else {
        this.#selectedValues.set([option.id]);
      }
      this.closePanel();
    } else {
      this.#selectedValues.set(isSelected ? value.filter(e => e !== option.id) : [...value, option.id]);
    }
    this.selectedValuesChange.emit(this.#selectedValues());
  }

  protected override formatInputValue(value: ID | ID[]): ID[] {
    return this.isMultiple() ? (value as ID[]) : [value as ID].filter(Boolean);
  }

  protected override formatOutputValue(value: ID[]): ID | ID[] {
    return this.isMultiple() ? (value as ID[]) : (value.at(0) ?? '');
  }

  protected filter(searchTerm: Nullable<string>, options: SelectItemModel[]): SelectItemModel[] {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  protected setupListenClickOutside(): void {
    fromEvent<MouseEvent>(this.document, 'click')
      .pipe(
        filter(event => {
          const isPanelClick = this.selectPanelComponent()?.element.contains(event.target as Node);
          const isTriggerClick = this.elementRef.nativeElement.contains(event.target);
          return !isPanelClick && !isTriggerClick;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.closePanel()
      });
  }

  protected updateAfterPanelOpen(): void {
    if (this.isPanelOpen()) {
      this.innerFocusedIndex.set(this.calcFocusIndex());
      setTimeout(() => this.focusOption(this.innerFocusedIndex()), 0);
    }
  }

  protected calcFocusIndex(): number {
    const ids: ID[] = this.#selectedValues();
    const focusedIndex = this.filteredOptions().findIndex(option => ids.includes(option.id));
    return focusedIndex >= 0 ? focusedIndex : 0;
  }

  protected setupSearchChange(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), takeUntilDestroyed(this.destroyRef)),
      this.options$.pipe(takeUntilDestroyed(this.destroyRef))
    ])
      .pipe(map(([searchTerm, options]) => this.filter(searchTerm, options)))
      .subscribe({
        next: options => this.innerFilteredOptions.set(options)
      });
  }

  protected focusOption(index: number): void {
    const optionEl = this.optionElements?.at(index);
    if (optionEl) {
      optionEl.nativeElement.scrollIntoView({ block: 'nearest' });
    }
  }

  protected setupHandleKeydownEvent(): void {
    fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keydown')
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: event => this.handleKeyDown(event)
      });
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (!this.isPanelOpen()) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.togglePanelSelection();
      }
      return;
    }

    const options = this.filteredOptions();
    let newIndex = this.innerFocusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(newIndex + 1, options.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(newIndex - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (newIndex >= 0) {
          this.selectChange(event, options[newIndex], newIndex);
        }
        break;
      case 'Escape':
        this.isPanelOpen.set(false);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = options.length - 1;
        break;
      case 'Tab':
        this.isPanelOpen.set(false);
        newIndex = -1;
        break;
    }

    if (newIndex !== this.innerFocusedIndex()) {
      this.innerFocusedIndex.set(newIndex);
      this.focusOption(newIndex);
    }
  }

  protected focusControlElement(): void {
    if (this.isSearchable && this.searchElement()?.nativeElement) {
      this.searchElement()!.nativeElement.focus();
    } else {
      this.elementRef.nativeElement.focus();
    }
  }

  protected override getDefaultValue(): ID[] {
    return [];
  }
}
