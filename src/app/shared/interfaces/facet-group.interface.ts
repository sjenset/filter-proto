import { Facet } from './facet.interface';

export interface FacetGroup {
  heading: string;
  facets: Facet[];
  expanded: boolean;
  groupId: number;
}
