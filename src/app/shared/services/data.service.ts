import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MOCK_DATA } from '../data/mock.data';
import { Categories } from '../enums/categories.enum';
import { EventTypes } from '../enums/event-types.enum';
import { FacetType } from '../enums/facet-type.enum';
import { Headings } from '../enums/headings.enum';
import { FacetToggleEvent } from '../interfaces/facet-toggle-event.interface';
import { Facet } from '../interfaces/facet.interface';
import { Item } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private facets$: BehaviorSubject<Facet[]> = new BehaviorSubject<Facet[]>(null);
  private items$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  private facetType$: BehaviorSubject<FacetType> = new BehaviorSubject<FacetType>(FacetType.OrgUnits);
  private heading$: BehaviorSubject<string> = new BehaviorSubject<string>(Headings.OrgUnits);

  constructor() {
    this.buildFacets();
  }

  public get items(): Observable<Item[]> {
    return this.items$.asObservable();
  }

  public get facets(): Observable<Facet[]> {
    return this.facets$.asObservable();
  }

  public get heading(): Observable<string> {
    return this.heading$.asObservable();
  }

  public toggleGroup(groupId: number): void {
    const facets = this.facets$.getValue();

    facets.forEach(f => {
      if (f.children.groupId === groupId) {
        f.children.expanded = !f.children.expanded;
      } else {
        f.children.facets.forEach(c => {
          if (c.children.groupId === groupId) {
            c.children.expanded = !c.children.expanded;
          }
        });
      }
    });
    this.facets$.next([...facets]);
  }

  public toggleFacet(data: FacetToggleEvent): void {
    const facetType = this.facetType$.getValue();
    const facets = this.facets$.getValue();

    switch (facetType) {
      case FacetType.OrgUnits:
        if (data.level3Id !== null && data.level3Id !== undefined) {
          const orgUnit = facets.find(f => f.id === data.level1Id);
          const category = orgUnit.children.facets.find(f => f.id === data.level2Id);
          const eventType = category.children.facets.find(f => f.id === data.level3Id);

          eventType.selected = !eventType.selected;

        } else if (data.level2Id !== null && data.level2Id !== undefined) {
          const orgUnit = facets.find(f => f.id === data.level1Id);
          const category = orgUnit.children.facets.find(f => f.id === data.level2Id);

          category.selected = !category.selected;
          if (!category.selected) {
            category.children.facets.filter(f => f.selected).forEach(e => e.selected = false);
          }

        } else {
          const orgUnit = facets.find(f => f.id === data.level1Id);

          orgUnit.selected = !orgUnit.selected;
          if (!orgUnit.selected) {
            orgUnit.children.facets.filter(f => f.selected).forEach(c => {
              c.children.facets.filter(f => f.selected).forEach(e => e.selected = false);
              c.selected = false;
            });
          }

        }
        break;
    }

    this.facets$.next([...facets]);
    this.updateItems();
  }

  private updateFacets(): void {
    // TODO: Do we need this?
  }

  private updateItems(): void {
    const facetType = this.facetType$.getValue();
    const facets = this.facets$.getValue();
    const newItems = [];

    switch (facetType) {
      case FacetType.OrgUnits:
        if (!facets.filter(o => o.selected).length) {
          this.items$.next([...MOCK_DATA.items]);

          break;
        }
        facets.filter(o => o.selected).forEach(o => {
          const categoryTypes: Categories[] = [];
          const eventTypes: EventTypes[] = [];
          let items = MOCK_DATA.items.filter(i => i.orgUnit === o.type);

          o.children.facets.filter(c => c.selected).forEach(c => {
            categoryTypes.push(c.type as Categories);
            c.children.facets.filter(e => e.selected).forEach(e => eventTypes.push(e.type as EventTypes));
          });
          items = items.filter(i => {
            return (!categoryTypes.length || categoryTypes.indexOf(i.categoryType) !== -1) &&
              (!eventTypes.length || eventTypes.indexOf(i.type) !== -1);
          });
          items.forEach(i => newItems.push(i));
        });

        this.items$.next([...newItems]);

        break;
    }
    this.updateFacets();
  }

  private buildFacets(): void {
    const facetType = this.facetType$.getValue();
    const facets: Facet[] = [];
    let groupId = 1;

    switch (facetType) {
      case FacetType.OrgUnits:
        MOCK_DATA.orgUnits.forEach(o => {
          const categoryFacets: Facet[] = [];
          const items = MOCK_DATA.items.filter(i => o.items.indexOf(i.id) !== -1);

          o.categories.forEach(cId => {
            const category = MOCK_DATA.categories.find(c => c.id === cId);
            const categoryItems = items.filter(i => i.categoryType === category.type);
            const eventTypes = [...new Set(categoryItems.map(i => i.type))];
            const eventTypeFacets: Facet[] = [];

            eventTypes.forEach(eType => {
              const eventType = MOCK_DATA.eventTypes.find(e => e.type === eType);

              if (eventType) {
                eventTypeFacets.push({
                  id: eventType.id,
                  type: eventType.type,
                  title: eventType.type.toString(),
                  selected: false,
                  itemAmount: categoryItems.filter(i => i.type === eventType.type).length
                });
              }
            });
            categoryFacets.push({
              id: category.id,
              type: category.type,
              title: category.type.toString(),
              selected: false,
              itemAmount: categoryItems.length,
              children: {
                heading: Headings.EventTypes,
                facets: eventTypeFacets,
                expanded: eventTypeFacets.length <= 4,
                groupId
              }
            });
            groupId++;
          });
          facets.push({
            id: o.id,
            type: o.type,
            title: o.type.toString(),
            selected: false,
            itemAmount: items.length,
            children: {
              heading: Headings.Categories,
              facets: categoryFacets,
              expanded: categoryFacets.length <= 4,
              groupId
            }
          });
          groupId++;
        });
        this.facets$.next([...facets]);

        break;
    }

    this.updateItems();
  }
}
