import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { MOCK_DATA } from '../data/mock.data';
import { Scope } from '../enums/scope.enum';
import { FacetGroup } from '../interfaces/facet-group.interface';
import { FacetToggleEvent } from '../interfaces/facet-toggle-event.interface';
import { Facet } from '../interfaces/facet.interface';
import { MockData } from '../interfaces/mock-data.interface';
import { Item } from '../interfaces/item.interface';
import { Categories } from '../enums/categories.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private facetGroups: BehaviorSubject<FacetGroup[]> = new BehaviorSubject<FacetGroup[]>(null);
  private itemCollection: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  private subscription: Subscription = new Subscription();

  constructor() {
    this.buildFacets();
    this.itemCollection.next(MOCK_DATA.items);
    this.items.subscribe(_ => this.updateFacets());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get items(): Observable<Item[]> {
    return this.itemCollection.asObservable();
  }

  public get facets(): Observable<FacetGroup[]> {
    return this.facetGroups.asObservable();
  }

  public get data(): MockData {
    return MOCK_DATA;
  }

  public toggleGroup(scope: Scope): void {
    const facetGroups = this.facetGroups.getValue();
    const group = facetGroups.find(fg => fg.scope === scope);

    if (!group.expandable) {
      return;
    }
    group.expanded = !group.expanded;
    this.facetGroups.next([...facetGroups]);
  }

  public toggleFacet(data: FacetToggleEvent): void {
    const facetGroups = this.facetGroups.getValue();
    let facet: Facet;

    if (data.scope === Scope.EventType) {
      const categories = facetGroups.find(fg => fg.scope === Scope.Category);
      const category = categories.facets.find(f => f.id === data.categoryId);

      facet = category.subFacets.find(sf => sf.id === data.id);
    } else {
      facet = facetGroups.find(fg => fg.scope === data.scope).facets.find(f => f.id === data.id);
    }

    facet.selected = !facet.selected;
    this.facetGroups.next([...facetGroups]);
    this.updateItems();
  }

  private updateFacets(): void {
    const itemCollection = this.itemCollection.getValue();
    const facetGroups = this.facetGroups.getValue();
    const orgUnit = facetGroups.find(fg => fg.scope === Scope.OrgUnit);
    const category = facetGroups.find(fg => fg.scope === Scope.Category);
    const orgUnits = orgUnit.facets.filter(f => f.selected).map(f => f.type);
    const categories = category.facets.filter(f => f.selected).map(f => f.type);

    orgUnit.facets.forEach(f => {
      f.itemAmount = itemCollection.filter(i => {
        return i.orgUnit === f.type && (!categories.length || categories.indexOf(i.categoryType) !== -1);
      }).length;
    });
    category.facets.forEach(f => {
      f.itemAmount = itemCollection.filter(i => {
        return i.categoryType === f.type && (!orgUnits.length || orgUnits.indexOf(i.orgUnit) !== -1);
      }).length;
      if (f.subFacets) {
        f.subFacets.forEach(sf => {
          sf.itemAmount = itemCollection.filter(i => i.categoryType === f.type && i.type === sf.type).length;
        });
      }
    });
  }

  private updateItems(): void {
    const facetGroups = this.facetGroups.getValue();
    const orgUnit = facetGroups.find(fg => fg.scope === Scope.OrgUnit);
    const category = facetGroups.find(fg => fg.scope === Scope.Category);
    const orgUnits = orgUnit.facets.filter(f => f.selected).map(f => f.type);
    const categories = category.facets.filter(f => f.selected).map(f => f.type);
    if (!orgUnits.length && !categories.length) {
      this.itemCollection.next(MOCK_DATA.items);
      facetGroups.find(fg => fg.scope === Scope.Category).facets.forEach(f => f.subFacets.forEach(sf => sf.selected = false));
      this.facetGroups.next([...facetGroups]);

      return;
    }
    let eventTypes = [];
    let items = [];

    category.facets.forEach(c => c.subFacets.filter(sf => sf.selected).forEach(sf => eventTypes.push(sf.type)));
    eventTypes = [...new Set(eventTypes)];
    items = [...MOCK_DATA.items].filter(i => orgUnits.indexOf(i.orgUnit) !== -1 || categories.indexOf(i.categoryType) !== -1);
    if (eventTypes.length) {
      items = items.filter(i => eventTypes.indexOf(i.type) !== -1);
    }

    this.itemCollection.next([...new Set(items)]);
  }

  private buildFacets(): void {
    const facetGroups: FacetGroup[] = [
      {
        heading: 'Org. enheter',
        scope: Scope.OrgUnit,
        facets: [],
        expandable: false,
        expanded: true
      },
      {
        heading: 'Kategorier',
        scope: Scope.Category,
        facets: [],
        expandable: true,
        expanded: false
      },
    ];

    MOCK_DATA.orgUnits.forEach(o => {
      facetGroups.find(f => f.scope === Scope.OrgUnit).facets.push({
        id: o.id,
        type: o.type,
        title: o.type.toString(),
        selected: false,
        itemAmount: 0
      });
    });
    MOCK_DATA.categories.forEach(c => {
      const items = MOCK_DATA.items.filter(i => i.categoryType === c.type);
      const eventTypes = [...new Set(items.map(i => i.type))];
      const subFacets: Facet[] = [];

      eventTypes.forEach(e => {
        const eventType = MOCK_DATA.eventTypes.find(et => et.type === e);

        subFacets.push({
          id: eventType.id,
          type: eventType.type,
          title: eventType.type.toString(),
          selected: false,
          itemAmount: 0
        });
      });
      facetGroups.find(f => f.scope === Scope.Category).facets.push({
        id: c.id,
        type: c.type,
        title: c.type.toString(),
        selected: false,
        itemAmount: 0,
        subFacets
      });
    });

    facetGroups.find(f => f.scope === Scope.Category).expanded = facetGroups.find(f => f.scope === Scope.Category).facets.length <= 4;

    this.facetGroups.next([...facetGroups]);
  }
}
