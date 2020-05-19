import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FacetToggleEvent } from './shared/interfaces/facet-toggle-event.interface';
import { Facet } from './shared/interfaces/facet.interface';
import { Item } from './shared/interfaces/item.interface';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public facets$: Observable<Facet[]>;
  public heading$: Observable<string>;
  public items$: Observable<Item[]>;
  public loadedItems: Item[] = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.items$ = this.dataService.items;
    this.facets$ = this.dataService.facets;
    this.heading$ = this.dataService.heading;
  }

  public onFacetToggled(data: FacetToggleEvent): void {
    this.dataService.toggleFacet(data);
  }

  public onGroupToggled(groupId: number): void {
    this.dataService.toggleGroup(groupId);
  }

  public onLoadData(): void {
    alert('NYI: Load data');
  }
}
