import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FacetToggleEvent } from '../shared/interfaces/facet-toggle-event.interface';
import { Facet } from '../shared/interfaces/facet.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() facets: Facet[];
  @Input() heading: string;

  @Output() facetToggled: EventEmitter<FacetToggleEvent> = new EventEmitter<FacetToggleEvent>();
  @Output() loadData: EventEmitter<void> = new EventEmitter<void>();
  @Output() groupToggled: EventEmitter<number> = new EventEmitter<number>();

  public toggleExpansion(e: MouseEvent | TouchEvent, groupId: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.groupToggled.emit(groupId);
  }

  public toggleFacet(e: MouseEvent | TouchEvent, level1Id: number, level2Id?: number, level3Id?: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.facetToggled.emit({ level1Id, level2Id, level3Id });
  }

  public load(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.loadData.emit();
  }
}
