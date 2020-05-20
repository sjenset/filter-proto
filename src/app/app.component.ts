import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FacetToggleEvent } from './shared/interfaces/facet-toggle-event.interface';
import { Facet } from './shared/interfaces/facet.interface';
import { Item } from './shared/interfaces/item.interface';
import { DataService } from './shared/services/data.service';
import { FacetType } from './shared/enums/facet-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public facets$: Observable<Facet[]>;
  public items$: Observable<Item[]>;
  public facetType$: Observable<FacetType>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.items$ = this.dataService.items;
    this.facets$ = this.dataService.facets;
    this.facetType$ = this.dataService.facetType;
  }

  public onFacetTypeSwitched(facetType: FacetType): void {
    this.dataService.switchFacetType(facetType);
  }

  public onFacetToggled(data: FacetToggleEvent): void {
    this.dataService.toggleFacet(data);
  }

  public onGroupToggled(groupId: number): void {
    this.dataService.toggleGroup(groupId);
  }
}
