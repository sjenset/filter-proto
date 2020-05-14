import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Scope } from '../shared/enums/scope.enum';
import { FacetGroup } from '../shared/interfaces/facet-group.interface';
import { FacetToggleEvent } from '../shared/interfaces/facet-toggle-event.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() facetGroups: FacetGroup[];

  @Output() facetToggled: EventEmitter<FacetToggleEvent> = new EventEmitter<FacetToggleEvent>();
  @Output() loadData: EventEmitter<void> = new EventEmitter<void>();
  @Output() groupToggled: EventEmitter<Scope> = new EventEmitter<Scope>();

  public Scope = Scope;

  public toggleExpansion(e: MouseEvent | TouchEvent, scope: Scope): void {
    e.preventDefault();
    e.stopPropagation();
    this.groupToggled.emit(scope);
  }

  public toggleFacet(e: MouseEvent | TouchEvent, scope: Scope, id: number, inactive: boolean = false, categoryId: number = null): void {
    e.preventDefault();
    e.stopPropagation();
    if (inactive) {
      return;
    }
    this.facetToggled.emit({ scope, id, categoryId });
  }

  public load(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.loadData.emit();
  }
}
