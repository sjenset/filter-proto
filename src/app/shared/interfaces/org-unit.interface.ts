import { OrgUnits } from '../enums/org-units.enum';

export interface OrgUnit {
  id: number;
  type: OrgUnits;
  items: number[];
  categories: number[];
  eventTypes: number[];
}
