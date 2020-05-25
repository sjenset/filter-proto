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
import { OrgUnits } from '../enums/org-units.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private facets$: BehaviorSubject<Facet[]> = new BehaviorSubject<Facet[]>(null);
  private items$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  private facetType$: BehaviorSubject<FacetType> = new BehaviorSubject<FacetType>(FacetType.OrgUnits);
  private changesDetected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private snapshot: string;

  constructor() {
    this.buildFacets();
  }

  public get changesDetected(): Observable<boolean> {
    return this.changesDetected$.asObservable();
  }

  public get facetType(): Observable<FacetType> {
    return this.facetType$.asObservable();
  }

  public get items(): Observable<Item[]> {
    return this.items$.asObservable();
  }

  public get facets(): Observable<Facet[]> {
    return this.facets$.asObservable();
  }

  public get shouldWarnOnLoad(): boolean {
    const items = this.items$.getValue();

    return items.length > 5;
  }

  public load(): void {
    const facets = this.facets$.getValue();
    const facetType = this.facetType$.getValue();

    this.snapshot = `${facetType}#${JSON.stringify(facets)}`;
    this.changesDetected$.next(false);
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

  public switchFacetType(facetType: FacetType): void {
    this.facetType$.next(facetType);
    this.buildFacets();
    this.checkSnapshot();
  }

  public toggleFacet(data: FacetToggleEvent): void {
    const facetType = this.facetType$.getValue();
    const facets = this.facets$.getValue();

    switch (facetType) {
      case FacetType.Categories:
        if (data.level3Id !== null && data.level3Id !== undefined) {
          const category = facets.find(f => f.id === data.level1Id);
          const orgUnit = category.children.facets.find(f => f.id === data.level2Id);
          const eventType = orgUnit.children.facets.find(f => f.id === data.level3Id);

          eventType.selected = !eventType.selected;

        } else if (data.level2Id !== null && data.level2Id !== undefined) {
          const category = facets.find(f => f.id === data.level1Id);
          const orgUnit = category.children.facets.find(f => f.id === data.level2Id);

          orgUnit.selected = !orgUnit.selected;
          if (!orgUnit.selected) {
            orgUnit.children.facets.filter(f => f.selected).forEach(e => e.selected = false);
          }

        } else {
          const category = facets.find(f => f.id === data.level1Id);

          category.selected = !category.selected;
          if (!category.selected) {
            category.children.facets.filter(f => f.selected).forEach(o => {
              o.children.facets.filter(f => f.selected).forEach(e => e.selected = false);
              o.selected = false;
            });
          }

        }
        break;
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
    this.checkSnapshot();
  }

  private updateFacets(): void {
    // TODO: Do we need this?
  }

  private updateItems(): void {
    const facetType = this.facetType$.getValue();
    const facets = this.facets$.getValue();
    const newItems = [];

    if (!facets.filter(o => o.selected).length) {
      this.items$.next([...MOCK_DATA.items]);

      return;
    }
    switch (facetType) {
      case FacetType.Categories:
        facets.filter(c => c.selected).forEach(c => {
          const orgUnits: OrgUnits[] = [];
          const eventTypes: EventTypes[] = [];
          let items = MOCK_DATA.items.filter(i => i.categoryType === c.type);

          c.children.facets.filter(o => o.selected).forEach(o => {
            orgUnits.push(o.type as OrgUnits);
            o.children.facets.filter(e => e.selected).forEach(e => eventTypes.push(e.type as EventTypes));
          });
          items = items.filter(i => {
            return (!orgUnits.length || orgUnits.indexOf(i.orgUnit) !== -1) &&
            (!eventTypes.length || eventTypes.indexOf(i.type) !== -1);
          });
          items.forEach(i => newItems.push(i));
        });
        console.error(newItems);
        break;
      case FacetType.OrgUnits:
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
        break;
    }
    this.items$.next([...newItems]);
    this.updateFacets();
  }

  private buildFacets(): void {
    const facetType = this.facetType$.getValue();
    const facets: Facet[] = [];
    let groupId = 1;

    switch (facetType) {
      case FacetType.Categories:
        MOCK_DATA.categories.forEach(c => {
          const orgUnitFacets: Facet[] = [];
          const items = MOCK_DATA.items.filter(i => i.categoryType === c.type);

          MOCK_DATA.orgUnits.filter(o => o.categories.indexOf(c.id) !== -1).forEach(o => {
            const orgUnitItems = MOCK_DATA.items.filter(i => o.items.indexOf(i.id) !== -1 && i.categoryType === c.type);
            const eventTypes = [...new Set(orgUnitItems.map(i => i.type))];
            const eventTypeFacets: Facet[] = [];

            eventTypes.forEach(eType => {
              const eventType = MOCK_DATA.eventTypes.find(e => e.type === eType);

              if (eventType) {
                eventTypeFacets.push({
                  id: eventType.id,
                  type: eventType.type,
                  title: eventType.type.toString(),
                  selected: false,
                  itemAmount: orgUnitItems.filter(i => i.type === eventType.type).length
                });
              }
            });
            orgUnitFacets.push({
              id: o.id,
              type: o.type,
              title: o.type.toString(),
              selected: false,
              itemAmount: orgUnitItems.length,
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
            id: c.id,
            type: c.type,
            title: c.type.toString(),
            selected: false,
            itemAmount: items.length,
            children: {
              heading: Headings.OrgUnits,
              facets: orgUnitFacets,
              expanded: orgUnitFacets.length <= 4,
              groupId
            }
          });
          groupId++;
        });
        break;
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

        break;
    }

    this.facets$.next([...facets]);
    this.updateItems();
  }

  private checkSnapshot(): void {
    const facets = this.facets$.getValue();
    const facetType = this.facetType$.getValue();
    const snapshotMatches = !this.snapshot || (this.snapshot === `${facetType}#${JSON.stringify(facets)}`);

    if (!snapshotMatches) {
      this.changesDetected$.next(true);
    }
  }
}
