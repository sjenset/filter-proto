import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Scope } from './shared/enums/scope.enum';
import { FacetGroup } from './shared/interfaces/facet-group.interface';
import { FacetToggleEvent } from './shared/interfaces/facet-toggle-event.interface';
import { Item } from './shared/interfaces/item.interface';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public facetGroups$: Observable<FacetGroup[]>;
  public items$: Observable<Item[]>;
  public loadedItems: Item[] = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.items$ = this.dataService.items;
    this.facetGroups$ = this.dataService.facets;
  }

  public onFacetToggled(data: FacetToggleEvent): void {
    this.dataService.toggleFacet(data);
  }

  public onGroupToggled(scope: Scope): void {
    this.dataService.toggleGroup(scope);
  }

  public onLoadData(): void {
    alert('NYI: Load data');
  }

  public onExpansionToggled(scope: Scope): void {

  }
}
