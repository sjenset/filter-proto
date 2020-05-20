import { Categories } from '../enums/categories.enum';
import { EventTypes } from '../enums/event-types.enum';
import { OrgUnits } from '../enums/org-units.enum';
import { MockData } from '../interfaces/mock-data.interface';

export const MOCK_DATA: MockData = {
  categories: [
    { id: 1, type: Categories.X },
    { id: 2, type: Categories.Y },
    { id: 3, type: Categories.Z }
  ],
  eventTypes: [
    { id: 1, type: EventTypes.A },
    { id: 2, type: EventTypes.B },
    { id: 3, type: EventTypes.C },
    { id: 4, type: EventTypes.D },
    { id: 5, type: EventTypes.E },
    { id: 6, type: EventTypes.F },
    { id: 7, type: EventTypes.G }
  ],
  items: [
    { id: 1, type: EventTypes.A, categoryType: Categories.X, orgUnit: OrgUnits.Æ },
    { id: 2, type: EventTypes.A, categoryType: Categories.X, orgUnit: OrgUnits.Ø },
    { id: 3, type: EventTypes.B, categoryType: Categories.X, orgUnit: OrgUnits.Æ },
    { id: 4, type: EventTypes.C, categoryType: Categories.Y, orgUnit: OrgUnits.Ø },
    { id: 5, type: EventTypes.D, categoryType: Categories.Y, orgUnit: OrgUnits.Ø },
    { id: 6, type: EventTypes.D, categoryType: Categories.Y, orgUnit: OrgUnits.Ø },
    { id: 7, type: EventTypes.E, categoryType: Categories.Z, orgUnit: OrgUnits.Å },
    { id: 8, type: EventTypes.E, categoryType: Categories.Z, orgUnit: OrgUnits.Å },
    { id: 9, type: EventTypes.F, categoryType: Categories.Z, orgUnit: OrgUnits.Å },
    { id: 10, type: EventTypes.G, categoryType: Categories.Z, orgUnit: OrgUnits.Å },
    { id: 11, type: EventTypes.G, categoryType: Categories.Z, orgUnit: OrgUnits.Ø }
  ],
  orgUnits: [
    {
      id: 1,
      type: OrgUnits.Æ,
      categories: [1],
      eventTypes: [1, 2],
      items: [1, 3]
    },
    {
      id: 2,
      type: OrgUnits.Ø,
      categories: [1, 2, 3],
      eventTypes: [1, 3, 4, 7],
      items: [2, 4, 5, 6, 11]
    },
    {
      id: 3,
      type: OrgUnits.Å,
      categories: [3],
      eventTypes: [5, 6, 7],
      items: [7, 8, 9, 10]
    }
  ]
};
