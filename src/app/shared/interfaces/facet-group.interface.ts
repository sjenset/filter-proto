import { Scope } from '../enums/scope.enum';
import { Facet } from './facet.interface';

export interface FacetGroup {
  heading: string;
  scope: Scope;
  facets: Facet[];
  expandable: boolean;
  expanded: boolean;
}
