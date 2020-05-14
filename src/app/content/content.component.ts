import { Component, Input } from '@angular/core';

import { Item } from '../shared/interfaces/item.interface';
import { MockData } from '../shared/interfaces/mock-data.interface';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  @Input() data: MockData;
  @Input() items: Item[];
}
