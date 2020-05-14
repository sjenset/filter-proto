import { Category } from './category.interface';
import { EventType } from './event-type.interface';
import { Item } from './item.interface';
import { OrgUnit } from './org-unit.interface';

export interface MockData {
  orgUnits: OrgUnit[];
  categories: Category[];
  eventTypes: EventType[];
  items: Item[];
}
