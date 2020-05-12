import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterData, Scope } from '../app.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() data: FilterData;
  @Input() scope: Scope;

  @Output() scopeSelected: EventEmitter<{scope: Scope, index: number}> = new EventEmitter<{scope: Scope, index: number}>();
  @Output() selectionCleared: EventEmitter<void> = new EventEmitter<void>();

  public Scopes = Scope;

  public select(e: MouseEvent | TouchEvent, scope: Scope, index: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.scopeSelected.emit({scope, index});
  }

  public clearSelection(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.selectionCleared.emit();
  }
}
