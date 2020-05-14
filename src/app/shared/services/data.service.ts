import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MOCK_DATA } from '../data/mock.data';
import { Scope } from '../enums/scope.enum';
import { FacetGroup } from '../interfaces/facet-group.interface';
import { FacetToggleEvent } from '../interfaces/facet-toggle-event.interface';
import { Facet } from '../interfaces/facet.interface';
import { MockData } from '../interfaces/mock-data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private facetGroups: BehaviorSubject<FacetGroup[]> = new BehaviorSubject<FacetGroup[]>(null);

  constructor() {
    this.buildFacets();
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
    let orgUnitSelected: boolean;
    let categorySelected: boolean;

    if (data.scope === Scope.EventType) {
      const categories = facetGroups.find(fg => fg.scope === Scope.Category);
      const category = categories.facets.find(f => f.id === data.categoryId);

      facet = category.subFacets.find(sf => sf.id === data.id);
    } else {
      facet = facetGroups.find(fg => fg.scope === data.scope).facets.find(f => f.id === data.id);
    }

    facet.selected = !facet.selected;
    orgUnitSelected = facetGroups.find(fg => fg.scope === Scope.OrgUnit).facets.findIndex(f => f.selected) !== -1;
    categorySelected = facetGroups.find(fg => fg.scope === Scope.Category).facets.findIndex(f => f.selected) !== -1;
    if (categorySelected) {
      facetGroups.find(fg => fg.scope === Scope.Category).facets.filter(f => !f.subFacets).forEach(f => {
        const items = MOCK_DATA.items.filter(i => i.categoryType === f.type);

        f.subFacets = [];
        [...new Set(items.map(i => i.type))].forEach(type => {
          const eventType = MOCK_DATA.eventTypes.find(e => e.type === type);
          f.subFacets.push({
            id: eventType.id,
            type: eventType.type,
            title: eventType.type.toString(),
            selected: false,
            itemAmount: items.filter(i => i.type === type).length
          });
        });
      });
    } else {
      const categories = facetGroups.filter(fg => fg.scope === Scope.Category);

      categories.forEach(c => c.facets.forEach(f => f.subFacets = null));
    }
    if (orgUnitSelected) {
      const selectedOrgUnitIds = facetGroups.find(fg => fg.scope === Scope.OrgUnit).facets.filter(f => f.selected).map(o => o.id);
      const selectedOrgUnits = MOCK_DATA.orgUnits.filter(o => selectedOrgUnitIds.indexOf(o.id) !== -1);

      facetGroups.find(fg => fg.scope === Scope.Category).facets.forEach(f => {
        f.itemAmount = MOCK_DATA.items.filter(i => i.categoryType === f.type &&
          selectedOrgUnits.map(o => o.items).reduce((a, b) => [...a, ...b], []).indexOf(i.id) !== -1).length;
        if (f.subFacets) {
          f.subFacets.forEach(sf => {
            sf.itemAmount = MOCK_DATA.items.filter(i => i.categoryType === f.type &&
              selectedOrgUnits.map(o => o.items).reduce((a, b) => [...a, ...b], []).indexOf(i.id) !== -1 &&
              selectedOrgUnits.map(o => o.eventTypes).reduce((a, b) => [...a, ...b], []).indexOf(i.id) !== -1).length;
          });
        }
      });
    } else {
      facetGroups.find(fg => fg.scope === Scope.Category).facets.forEach(f => {
        f.itemAmount = MOCK_DATA.items.filter(i => i.categoryType === f.type).length;
        if (f.subFacets) {
          f.subFacets.forEach(sf => {
            sf.itemAmount = MOCK_DATA.items.filter(i => i.type === sf.type).length;
          });
        }
      });
    }
    this.facetGroups.next([...facetGroups]);
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
      }
    ];

    MOCK_DATA.orgUnits.forEach(o => {
      facetGroups.find(f => f.scope === Scope.OrgUnit).facets.push({
        id: o.id,
        type: o.type,
        title: o.type.toString(),
        selected: false,
        itemAmount: MOCK_DATA.items.filter(i => o.items.indexOf(i.id) !== -1).length
      });
    });
    MOCK_DATA.categories.forEach(c => {
      facetGroups.find(f => f.scope === Scope.Category).facets.push({
        id: c.id,
        type: c.type,
        title: c.type.toString(),
        selected: false,
        itemAmount: MOCK_DATA.items.filter(i => i.categoryType === c.type).length
      });
    });

    facetGroups.find(f => f.scope === Scope.Category).expanded = facetGroups.find(f => f.scope === Scope.Category).facets.length <= 4;

    this.facetGroups.next([...facetGroups]);
  }
}
