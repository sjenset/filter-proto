enum OrgUnitType {
  'Æ' = 'Org. enhet 1',
  'Ø' = 'Org. enhet 2',
  'Å' = 'Org. enhet 3'
}

enum CategoryType {
  'X' = 'Kategori XX',
  'Y' = 'Kategori YY',
  'Z' = 'Kategori ZZ'
}

enum EventType {
  'A' = 'Hendelsestype A',
  'B' = 'Hendelsestype B',
  'C' = 'Hendelsestype C',
  'D' = 'Hendelsestype D',
  'E' = 'Hendelsestype E',
  'F' = 'Hendelsestype F',
  'G' = 'Hendelsestype G'
}

export interface Category {
  type: CategoryType;
}

export interface Event {
  type: EventType;
}

export interface Item {
  id: number;
  type: EventType;
  categoryType: CategoryType;
  orgUnit: OrgUnitType;
}

export interface OrgUnit {
  type: OrgUnitType;
  items: number[];
  categories: number[];
  events: number[];
}

export interface MockData {
  orgUnits: OrgUnit[];
  categories: Category[];
  events: Event[];
  items: Item[];
}

export const MOCK_DATA: MockData = {
  categories: [
    { type: CategoryType.X },
    { type: CategoryType.Y },
    { type: CategoryType.Z }
  ],
  events: [
    { type: EventType.A },
    { type: EventType.B },
    { type: EventType.C },
    { type: EventType.D },
    { type: EventType.E },
    { type: EventType.F },
    { type: EventType.G }
  ],
  items: [
    { id: 0, type: EventType.A, categoryType: CategoryType.X, orgUnit: OrgUnitType.Æ },
    { id: 1, type: EventType.A, categoryType: CategoryType.X, orgUnit: OrgUnitType.Ø },
    { id: 2, type: EventType.B, categoryType: CategoryType.X, orgUnit: OrgUnitType.Æ },
    { id: 3, type: EventType.C, categoryType: CategoryType.Y, orgUnit: OrgUnitType.Ø },
    { id: 4, type: EventType.D, categoryType: CategoryType.Y, orgUnit: OrgUnitType.Ø },
    { id: 5, type: EventType.D, categoryType: CategoryType.Y, orgUnit: OrgUnitType.Ø },
    { id: 6, type: EventType.E, categoryType: CategoryType.Z, orgUnit: OrgUnitType.Å },
    { id: 7, type: EventType.E, categoryType: CategoryType.Z, orgUnit: OrgUnitType.Å },
    { id: 8, type: EventType.F, categoryType: CategoryType.Z, orgUnit: OrgUnitType.Å },
    { id: 9, type: EventType.G, categoryType: CategoryType.Z, orgUnit: OrgUnitType.Å },
    { id: 10, type: EventType.G, categoryType: CategoryType.Z, orgUnit: OrgUnitType.Ø }
  ],
  orgUnits: [
    {
      type: OrgUnitType.Æ,
      categories: [0],
      events: [0, 1],
      items: [0, 2]
    },
    {
      type: OrgUnitType.Ø,
      categories: [0, 1, 2],
      events: [0, 2, 3, 6],
      items: [1, 3, 4, 5, 10]
    },
    {
      type: OrgUnitType.Å,
      categories: [2],
      events: [4, 5, 6],
      items: [6, 7, 8, 9]
    }
  ]
};
