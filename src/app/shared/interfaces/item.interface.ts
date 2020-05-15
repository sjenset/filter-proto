import { Categories } from '../enums/categories.enum';
import { EventTypes } from '../enums/event-types.enum';
import { OrgUnits } from '../enums/org-units.enum';

export interface Item {
  id: number;
  type: EventTypes;
  categoryType: Categories;
  orgUnit: OrgUnits;
  visible: boolean;
}
