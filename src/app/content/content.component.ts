import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { Item } from '../shared/interfaces/item.interface';
import { MockData } from '../shared/interfaces/mock-data.interface';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() data: MockData;
  @Input() items: Item[];

  @Output() loadRequested: EventEmitter<void> = new EventEmitter<void>();

  public loadedItems: Item[] = [];
  public changesDetected$: Observable<boolean>;
  public itemsLoaded = false;

  private warning = 'Du har valgt å laste en stor mengde data, som kan ta noe tid. Ønsker du å fortsette, eller avbryte og justere filtrene dine?';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.changesDetected$ = this.dataService.changesDetected;
  }

  public loadData(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.dataService.shouldWarnOnLoad && !confirm(this.warning)) {
      return;
    }
    this.dataService.load();
    this.loadedItems = [...this.items];
    this.itemsLoaded = true;
  }
}
