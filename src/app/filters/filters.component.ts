import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FacetToggleEvent } from '../shared/interfaces/facet-toggle-event.interface';
import { Facet } from '../shared/interfaces/facet.interface';
import { FacetType } from '../shared/enums/facet-type.enum';
import { Headings } from '../shared/enums/headings.enum';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() facets: Facet[];
  @Input() facetType: FacetType;

  @Output() facetToggled: EventEmitter<FacetToggleEvent> = new EventEmitter<FacetToggleEvent>();
  @Output() groupToggled: EventEmitter<number> = new EventEmitter<number>();
  @Output() facetTypeSwitched: EventEmitter<FacetType> = new EventEmitter<FacetType>();

  public Headings = Headings;
  public FacetTypes = FacetType;

  public toggleFacetType(e: MouseEvent | TouchEvent, facetType: string): void {
    e.preventDefault();
    e.stopPropagation();
    if (FacetType[this.facetType] === FacetType[FacetType[facetType]]) {
      return;
    }
    this.facetTypeSwitched.emit(FacetType[facetType]);
  }

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
}
