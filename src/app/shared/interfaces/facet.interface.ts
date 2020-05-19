import { Categories } from '../enums/categories.enum';
import { EventTypes } from '../enums/event-types.enum';
import { OrgUnits } from '../enums/org-units.enum';
import { FacetGroup } from './facet-group.interface';

export interface Facet {
  id: number;
  type: OrgUnits | Categories | EventTypes;
  title: string;
  selected: boolean;
  itemAmount: number;
  children?: FacetGroup;
}
