import { Component, OnInit } from '@angular/core';

import { DataService } from './data/data.service';
import { Category, Event, Item, MockData, OrgUnit } from './data/mock.data';


interface CountMap {
  [key: string]: number;
}

export class FilterData {
  public orgUnits: OrgUnit[] = [];
  public items: Item[] = [];
  public categories: Category[] = [];
  public events: Event[] = [];
  public orgUnitCounts: CountMap = {};
  public categoryCounts: CountMap = {};
  public eventTypeCounts: CountMap = {};

  private mockData: MockData;

  constructor(dataService: DataService) {
    this.mockData = dataService.getData();
    this.init();
  }

  public selectOrgUnit(index: number): void {
    const orgUnit = this.orgUnits[index];

    this.orgUnits = [orgUnit];
    this.categories = orgUnit.categories.map(c => this.categories[c]);
    this.events = orgUnit.events.map(e => this.events[e]);
    this.items = this.items.filter(i => orgUnit.items.indexOf(i.id) !== -1);
    this.getCounts();
  }

  public selectCategory(index: number): void {
    this.init();
    const orgUnits = this.orgUnits.filter(ou => ou.categories.indexOf(index) !== -1);
    const category = this.categories[index];
    const events = [];

    orgUnits.forEach(ou => {
      ou.items.forEach(i => {
        if (this.items[i].categoryType === category.type) {
          events.push(this.events.find(e => e.type === this.items[i].type));
        }
      });
    });
    this.orgUnits = orgUnits;
    this.categories = [category];
    this.events = [...new Set(events)];
    this.items = this.items.filter(i => i.categoryType === category.type);
    this.getCounts();
  }

  public selectEventType(index: number): void {
    this.init();
    const orgUnits = this.orgUnits.filter(ou => ou.events.indexOf(index) !== -1);
    const eventType = this.events[index];
    const categories = [];

    orgUnits.forEach(ou => {
      ou.items.forEach(i => {
        if (this.items[i].type === eventType.type) {
          categories.push(this.categories.find(c => c.type === this.items[i].categoryType));
        }
      });
    });
    this.orgUnits = orgUnits;
    this.categories = [...new Set(categories)];
    this.events = [eventType];
    this.items = this.items.filter(i => i.type === eventType.type);
    this.getCounts();
  }

  public clearSelection(): void {
    this.init();
  }

  private init(): void {
    this.orgUnits = [...this.mockData.orgUnits];
    this.categories = [...this.mockData.categories];
    this.events = [...this.mockData.events];
    this.items = [...this.mockData.items.sort((a, b) => a.orgUnit.localeCompare(b.orgUnit))];
    this.getCounts();
  }

  private getCounts(): void {
    this.orgUnitCounts = {};
    this.categoryCounts = {};
    this.eventTypeCounts = {};
    this.items.forEach(i => {
      if (this.eventTypeCounts[i.type] === undefined) {
        this.eventTypeCounts[i.type] = 0;
      }
      if (this.categoryCounts[i.categoryType] === undefined) {
        this.categoryCounts[i.categoryType] = 0;
      }
      this.eventTypeCounts[i.type]++;
      this.categoryCounts[i.categoryType]++;
    });
    this.orgUnits.forEach(ou => {
      this.orgUnitCounts[ou.type] = this.items.filter(i => ou.items.indexOf(i.id) !== -1).length;
    });
  }
}

export enum Scope {
  'Initial',
  'OrgUnit',
  'Category',
  'EventType'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public filterData: FilterData = null;
  public scope: Scope = Scope.Initial;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.filterData = new FilterData(this.dataService);
  }

  public onScopeSelected(data: { scope: Scope, index: number }): void {
    switch (data.scope) {
      case Scope.OrgUnit:
        this.filterData.selectOrgUnit(data.index);
        break;
      case Scope.Category:
        this.filterData.selectCategory(data.index);
        break;
      case Scope.EventType:
        this.filterData.selectEventType(data.index);
        break;
    }
    this.scope = data.scope;
  }

  public onSelectionCleared(): void {
    this.filterData.clearSelection();
    this.scope = Scope.Initial;
  }
}
