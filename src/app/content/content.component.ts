import { Component, Input } from '@angular/core';

import { MockData } from '../data/mock.data';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  @Input() data: MockData;
}
