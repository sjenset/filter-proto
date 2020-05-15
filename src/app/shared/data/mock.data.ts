import { Categories } from '../enums/categories.enum';
import { EventTypes } from '../enums/event-types.enum';
import { OrgUnits } from '../enums/org-units.enum';
import { MockData } from '../interfaces/mock-data.interface';

export const MOCK_DATA: MockData = {
  categories: [
    { id: 0, type: Categories.X },
    { id: 1, type: Categories.Y },
    { id: 2, type: Categories.Z }
  ],
  eventTypes: [
    { id: 0, type: EventTypes.A },
    { id: 1, type: EventTypes.B },
    { id: 2, type: EventTypes.C },
    { id: 3, type: EventTypes.D },
    { id: 4, type: EventTypes.E },
    { id: 5, type: EventTypes.F },
    { id: 6, type: EventTypes.G }
  ],
  items: [
    { id: 0, type: EventTypes.A, categoryType: Categories.X, orgUnit: OrgUnits.Æ, visible: true },
    { id: 1, type: EventTypes.A, categoryType: Categories.X, orgUnit: OrgUnits.Ø, visible: true },
    { id: 2, type: EventTypes.B, categoryType: Categories.X, orgUnit: OrgUnits.Æ, visible: true },
    { id: 3, type: EventTypes.C, categoryType: Categories.Y, orgUnit: OrgUnits.Ø, visible: true },
    { id: 4, type: EventTypes.D, categoryType: Categories.Y, orgUnit: OrgUnits.Ø, visible: true },
    { id: 5, type: EventTypes.D, categoryType: Categories.Y, orgUnit: OrgUnits.Ø, visible: true },
    { id: 6, type: EventTypes.E, categoryType: Categories.Z, orgUnit: OrgUnits.Å, visible: true },
    { id: 7, type: EventTypes.E, categoryType: Categories.Z, orgUnit: OrgUnits.Å, visible: true },
    { id: 8, type: EventTypes.F, categoryType: Categories.Z, orgUnit: OrgUnits.Å, visible: true },
    { id: 9, type: EventTypes.G, categoryType: Categories.Z, orgUnit: OrgUnits.Å, visible: true },
    { id: 10, type: EventTypes.G, categoryType: Categories.Z, orgUnit: OrgUnits.Ø, visible: true }
  ],
  orgUnits: [
    {
      id: 0,
      type: OrgUnits.Æ,
      categories: [0],
      eventTypes: [0, 1],
      items: [0, 2]
    },
    {
      id: 1,
      type: OrgUnits.Ø,
      categories: [0, 1, 2],
      eventTypes: [0, 2, 3, 6],
      items: [1, 3, 4, 5, 10]
    },
    {
      id: 2,
      type: OrgUnits.Å,
      categories: [2],
      eventTypes: [4, 5, 6],
      items: [6, 7, 8, 9]
    }
  ]
};
