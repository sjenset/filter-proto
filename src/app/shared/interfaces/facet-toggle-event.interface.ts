import { Scope } from '../enums/scope.enum';

export interface FacetToggleEvent {
  scope: Scope;
  id: number;
  categoryId: number;
}
